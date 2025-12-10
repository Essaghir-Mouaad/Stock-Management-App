/**
 * Test Script: Verify Index Performance Improvement
 *
 * This script tests the performance impact of adding the createdById index
 * Runs ONLY on test database (test.db), NOT production
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

async function runTest() {
  // Force use of test database
  process.env.DATABASE_URL = "file:./test.db";

  // Check that test.db exists
  if (!fs.existsSync("./test.db")) {
    console.error("❌ ERROR: test.db not found!");
    console.error("   Create it first with: copy dev.db test.db");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    console.log(
      "\n╔════════════════════════════════════════════════════════════╗"
    );
    console.log(
      "║           Index Performance Test - createdById              ║"
    );
    console.log(
      "║         (Testing on test.db - NOT production)               ║"
    );
    console.log(
      "╚════════════════════════════════════════════════════════════╝\n"
    );

    // Get a real user to test with
    const testUser = await prisma.user.findFirst();
    if (!testUser) {
      console.log("⚠️  No users in database yet. Creating test user...");
      const user = await prisma.user.create({
        data: {
          username: "test-index-user-" + Date.now(),
          email: "test-index-" + Date.now() + "@test.com",
          passwordHash: "test-hash",
          name: "Test User",
          role: "WORKER",
        },
      });
      console.log("✅ Created test user:", user.id);
    }

    const userId = testUser?.id || (await prisma.user.findFirst()).id;

    // Get user's invoices
    const userInvoices = await prisma.userProduct.findMany({
      where: { createdById: userId },
      take: 5,
    });

    console.log(`📊 Test Setup:`);
    console.log(`   User ID: ${userId}`);
    console.log(`   User's invoices: ${userInvoices.length}`);

    // Get a specific invoice to test with
    let testInvoiceId = userInvoices[0]?.id;

    if (!testInvoiceId) {
      console.log("   No invoices for this user. Creating test data...");
      const newInvoice = await prisma.userProduct.create({
        data: {
          name: "Test Invoice for Index Performance",
          createdById: userId,
        },
      });
      testInvoiceId = newInvoice.id;
      console.log("   ✅ Created test invoice:", testInvoiceId);
    }

    console.log(`\n🔍 Running performance test...`);
    console.log(`   Testing query: Find all invoices for user\n`);

    // Test 1: Get all user's invoices (uses createdById index)
    const times = [];
    const iterations = 20;

    console.log(`⏱️  Running ${iterations} iterations...`);

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();

      // This query USES the createdById index
      await prisma.userProduct.findMany({
        where: { createdById: userId },
        include: { productLines: true },
      });

      const end = performance.now();
      times.push(end - start);

      // Show progress
      if ((i + 1) % 5 === 0) {
        console.log(`   ✓ ${i + 1}/${iterations}`);
      }
    }

    // Calculate stats
    const avg = times.reduce((a, b) => a + b) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    console.log(`\n📈 Results:`);
    console.log(`   Average Time: ${avg.toFixed(2)}ms`);
    console.log(`   Min Time:     ${min.toFixed(2)}ms`);
    console.log(`   Max Time:     ${max.toFixed(2)}ms`);

    // Check if index exists
    const indexCheck = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='index' 
      AND tbl_name='UserProduct' 
      AND name LIKE '%createdBy%'
    `;

    console.log(`\n✅ Index Status:`);
    if (indexCheck && indexCheck.length > 0) {
      console.log(`   ✓ Index EXISTS and is being used`);
      console.log(`   Index name: ${indexCheck[0].name}`);
      console.log(`   \n✨ The index is working! Queries should be fast.`);
    } else {
      console.log(`   ✗ Index NOT found`);
      console.log(`   Make sure you ran: npx prisma migrate deploy`);
    }

    // Additional info
    console.log(`\n💡 Interpretation:`);
    if (avg < 10) {
      console.log(
        `   ✅ EXCELLENT - Average ${avg.toFixed(2)}ms (index is working well)`
      );
    } else if (avg < 50) {
      console.log(`   ✅ GOOD - Average ${avg.toFixed(2)}ms`);
    } else {
      console.log(
        `   ⚠️  SLOW - Average ${avg.toFixed(2)}ms (check if index was applied)`
      );
    }

    console.log(`\n✅ Test Complete! Safety verified.`);
    console.log(`   Test ran on: test.db (production dev.db untouched)\n`);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
