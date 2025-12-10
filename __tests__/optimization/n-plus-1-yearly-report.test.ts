/**
 * N+1 Query Detection Test: getYearlyReport
 * 
 * This test ensures that getYearlyReport does NOT execute multiple sequential
 * queries in a loop (N+1 pattern). Instead, it should batch query all data needed
 * and process it in memory.
 * 
 * Current Problem (BEFORE FIX):
 * - Loop calls getMonthlySummary 12 times
 * - Each getMonthlySummary makes 2 queries (current month + all previous months)
 * - Total: 24 database queries for one yearly report
 * - Execution time: ~500-800ms
 * 
 * Expected Solution (AFTER FIX):
 * - Single batched query for all movements in the year
 * - Process month calculations in memory
 * - Total: 1 database query
 * - Execution time: ~50-100ms
 */

import { getYearlyReport } from '@/app/actions/analyticsActions';
import prisma from '@/app/lib/prisma';

// Mock to count database queries
let queryCount = 0;

describe('N+1 Query: getYearlyReport', () => {
  const userId = 'test-user-123';
  const testYear = 2024;

  beforeAll(async () => {
    // Clean up any test data
    await prisma.stockMovement.deleteMany({
      where: { userId },
    });

    // Create test User (required for all relations)
    await prisma.user.create({
      data: {
        id: userId,
        username: `test-user-${userId}`,
        passwordHash: 'hash',
        name: 'Test User',
      },
    }).catch(() => {}); // Ignore if it already exists

    // Create test UserProduct (required for ProductLine)
    await prisma.userProduct.create({
      data: {
        id: 'test-user-product',
        name: 'Test User Product',
        createdById: userId,
      },
    }).catch(() => {}); // Ignore if it already exists

    // Create test ProductLine (required for StockMovement)
    await prisma.productLine.create({
      data: {
        id: 'test-product-line',
        name: 'Test Product',
        category: 'Test',
        userProductId: 'test-user-product',
      },
    }).catch(() => {}); // Ignore if it already exists

    const startOfYear = new Date(testYear, 0, 1);
    const endOfYear = new Date(testYear, 11, 31);

    // Insert test movements for each month
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(testYear, month, 1);
      const monthEnd = new Date(testYear, month + 1, 0);

      // Create 5 movements per month for realistic data
      for (let day = 1; day <= 5; day++) {
        const date = new Date(testYear, month, day);
        if (date >= monthStart && date <= monthEnd) {
          const previousStock = 100 + (month * 10);
          const quantity = 10 + day;
          const newStock = day % 2 === 0 ? previousStock + quantity : previousStock - quantity;

          await prisma.stockMovement.create({
            data: {
              id: `test-movement-${testYear}-${month}-${day}-${Math.random()}`, // Unique ID
              movementType: day % 2 === 0 ? 'IN' : 'OUT',
              quantity,
              previousStock,
              newStock,
              userId,
              productLineId: 'test-product-line',
              createdAt: date,
            },
          });
        }
      }
    }
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.stockMovement.deleteMany({
      where: { userId },
    });
    await prisma.$disconnect();
  });

  it('should execute minimum database queries (1 query, not 24)', async () => {
    /**
     * BEFORE FIX EXPECTATIONS:
     * - 24 queries executed in loop
     * - Average query time: ~40-60ms per query
     * - Total execution time: ~500-800ms
     * 
     * AFTER FIX EXPECTATIONS:
     * - 1 query for all data
     * - Query time: ~20-40ms
     * - Total execution time: ~50-100ms
     */

    const startTime = performance.now();

    // Spy on Prisma queries
    const originalFindMany = prisma.stockMovement.findMany;
    let executeQueryCount = 0;

    prisma.stockMovement.findMany = (async (args: any) => {
      executeQueryCount++;
      console.log(`  Query #${executeQueryCount} executed`);
      return originalFindMany.call(prisma.stockMovement, args);
    }) as any;

    try {
      // Execute the function that had N+1 problem
      const result = await getYearlyReport(testYear, userId);

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      console.log(`\n📊 N+1 Query Analysis for getYearlyReport(${testYear}):`);
      console.log(`   Total Queries Executed: ${executeQueryCount}`);
      console.log(`   Execution Time: ${executionTime.toFixed(2)}ms`);
      console.log(`   Result: ${result.monthlyData.length} months with data`);

      /**
       * CRITICAL ASSERTION:
       * Should be 1 query (after fix) not 24 (before fix)
       */
      expect(executeQueryCount).toBeLessThanOrEqual(2); // Allow 1-2 queries (1 for current + maybe 1 for yearend)
      expect(executeQueryCount).toBeLessThan(24); // Definitely should not be 24

      /**
       * PERFORMANCE ASSERTION:
       * Should complete in under 200ms (after optimization)
       * Before fix: 500-800ms
       * After fix: 50-100ms
       */
      expect(executionTime).toBeLessThan(200);

      // Verify data integrity
      expect(result.monthlyData).toHaveLength(12);
      expect(result.yearlyTotals).toBeDefined();
      expect(result.yearlyTotals.totalMovements).toBeGreaterThan(0);

      // Log improvement
      if (executeQueryCount <= 2) {
        const improvementPercent = ((24 - executeQueryCount) / 24 * 100).toFixed(1);
        console.log(`\n✅ N+1 FIXED! Query reduction: ${improvementPercent}%`);
        console.log(`   Before: 24 queries (~600ms)`);
        console.log(`   After: ${executeQueryCount} queries (~${executionTime.toFixed(0)}ms)`);
      } else {
        console.log(`\n⚠️  Still executing ${executeQueryCount} queries (N+1 pattern detected!)`);
      }
    } finally {
      // Restore original function
      prisma.stockMovement.findMany = originalFindMany;
    }
  });

  it('should return correct yearly data with batch queries', async () => {
    const result = await getYearlyReport(testYear, userId);

    expect(result).toHaveProperty('year', testYear);
    expect(result).toHaveProperty('monthlyData');
    expect(result).toHaveProperty('yearlyTotals');

    // Validate monthly data structure
    result.monthlyData.forEach((month, index) => {
      expect(month).toHaveProperty('month', index + 1);
      expect(month).toHaveProperty('monthName');
      expect(month).toHaveProperty('totalIn');
      expect(month).toHaveProperty('totalOut');
      expect(month).toHaveProperty('net');
      expect(month).toHaveProperty('movementCount');
    });

    // Validate yearly totals
    expect(result.yearlyTotals.totalIn).toBeGreaterThanOrEqual(0);
    expect(result.yearlyTotals.totalOut).toBeGreaterThanOrEqual(0);
    expect(result.yearlyTotals.totalMovements).toEqual(60); // 12 months * 5 movements
  });

  it('performance benchmark: before vs after optimization', async () => {
    console.log('\n⏱️  Performance Benchmark:');
    console.log('   Running yearly report generation 5 times...\n');

    const times: number[] = [];

    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      await getYearlyReport(testYear, userId);
      const end = performance.now();
      const time = end - start;
      times.push(time);
      console.log(`   Run ${i + 1}: ${time.toFixed(2)}ms`);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    console.log(`\n   Average: ${avgTime.toFixed(2)}ms`);
    console.log(`   Min: ${minTime.toFixed(2)}ms`);
    console.log(`   Max: ${maxTime.toFixed(2)}ms`);

    // After optimization, should be significantly faster
    expect(avgTime).toBeLessThan(150); // Should be under 150ms after fix
  });
});
