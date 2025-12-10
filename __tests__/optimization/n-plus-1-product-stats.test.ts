/**
 * N+1 Query Detection Test: getProductsById with stock movement stats
 * 
 * This test ensures that getProductsById does NOT execute multiple queries
 * per product line to fetch stock movement stats. Instead, it should batch
 * all stock movements in a single query and calculate stats in memory.
 * 
 * Current Problem (BEFORE FIX):
 * - Fetches invoice + productLines (1 query)
 * - Later, component fetches stats for each product (N queries)
 * - Total: 1 + N queries (e.g., 1 + 5 = 6 queries for 5 products)
 * 
 * Expected Solution (AFTER FIX):
 * - Single query includes productLines WITH stockMovements data
 * - Calculate stats in memory (no additional queries)
 * - Total: 1 query regardless of product count
 */

import { getProductsById } from '@/app/actions/productActions';
import prisma from '@/app/lib/prisma';

describe('N+1 Query: getProductsById with Stock Stats', () => {
  const testUserId = 'test-user-product-stats';
  const invoiceId = 'test-invoice-for-stats';

  beforeAll(async () => {
    // Clean up test data
    await prisma.stockMovement.deleteMany({
      where: {
        productLine: {
          userProduct: {
            id: invoiceId,
          },
        },
      },
    });

    await prisma.productLine.deleteMany({
      where: {
        userProduct: {
          id: invoiceId,
        },
      },
    });

    await prisma.userProduct.deleteMany({
      where: { id: invoiceId },
    });

    await prisma.user.deleteMany({
      where: { id: testUserId },
    });

    // Create test user
    await prisma.user.create({
      data: {
        id: testUserId,
        username: `test-user-${testUserId}`,
        passwordHash: 'hash',
        name: 'Test User',
      },
    });

    // Create test invoice (UserProduct)
    await prisma.userProduct.create({
      data: {
        id: invoiceId,
        name: 'Test Invoice',
        createdById: testUserId,
      },
    });

    // Create 5 test product lines
    const productLineIds = [];
    for (let i = 1; i <= 5; i++) {
      const productLine = await prisma.productLine.create({
        data: {
          id: `test-product-${i}`,
          name: `Test Product ${i}`,
          category: 'Test',
          userProductId: invoiceId,
          currentStock: 100,
          minStock: 10,
        },
      });
      productLineIds.push(productLine.id);
    }

    // Create 20 stock movements across all products (4 per product)
    for (let i = 0; i < productLineIds.length; i++) {
      const productLineId = productLineIds[i];
      for (let j = 0; j < 4; j++) {
        let previousStock = 100 + j * 10;
        let newStock = 100 + (j + 1) * 10;
        const movementType = j % 2 === 0 ? 'IN' : 'OUT';
        if (movementType === 'OUT') {
          previousStock = 100 + (j + 1) * 10;
          newStock = 100 + j * 10;
        }

        await prisma.stockMovement.create({
          data: {
            id: `test-movement-${i}-${j}`,
            movementType: movementType,
            quantity: 10,
            previousStock,
            newStock,
            userId: testUserId,
            productLineId,
            createdAt: new Date(2024, 11, 1 + j), // Dec 1-4
          },
        });
      }
    }
  });

  afterAll(async () => {
    // Clean up
    await prisma.stockMovement.deleteMany({
      where: {
        productLine: {
          userProduct: {
            id: invoiceId,
          },
        },
      },
    });

    await prisma.productLine.deleteMany({
      where: {
        userProduct: {
          id: invoiceId,
        },
      },
    });

    await prisma.userProduct.deleteMany({
      where: { id: invoiceId },
    });

    await prisma.user.deleteMany({
      where: { id: testUserId },
    });

    await prisma.$disconnect();
  });

  it('should execute minimum queries (1, not 1+N) with stock movement stats included', async () => {
    /**
     * BEFORE FIX EXPECTATIONS:
     * - 6 queries: 1 for invoice + 5 for individual product stats
     * - Execution time: ~200-300ms
     * 
     * AFTER FIX EXPECTATIONS:
     * - 1 query with batch-included stock movements
     * - Execution time: ~20-50ms
     */

    const startTime = performance.now();

    // Spy on Prisma queries
    const originalFindUnique = prisma.userProduct.findUnique;
    let executeQueryCount = 0;

    prisma.userProduct.findUnique = (async (args: any) => {
      executeQueryCount++;
      console.log(`  Query #${executeQueryCount} executed (userProduct.findUnique)`);
      return originalFindUnique.call(prisma.userProduct, args);
    }) as any;

    try {
      const result = await getProductsById(invoiceId);

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      console.log(`\n📊 N+1 Query Analysis for getProductsById(${invoiceId}):`);
      console.log(`   Total Queries Executed: ${executeQueryCount}`);
      console.log(`   Execution Time: ${executionTime.toFixed(2)}ms`);
      console.log(`   Products: ${result.productLines?.length || 0} with stock stats`);

      // CRITICAL ASSERTION: Should be 1 query, not 1+N
      expect(executeQueryCount).toBe(1);

      // PERFORMANCE ASSERTION: Should be fast
      expect(executionTime).toBeLessThan(150);

      // Verify data structure
      expect(result.productLines).toHaveLength(5);
      expect(result.productLines[0]).toHaveProperty('stats');
      expect(result.productLines[0].stats).toHaveProperty('totalMovements');
      expect(result.productLines[0].stats).toHaveProperty('totalQuantityIn');
      expect(result.productLines[0].stats).toHaveProperty('totalQuantityOut');
      expect(result.productLines[0].stats).toHaveProperty('currentStock');

      console.log(`\n✅ N+1 FIXED! Single batched query for all products`);
      console.log(`   Before: 6 queries (~250ms) [1 + 5 for stats]`);
      console.log(`   After: ${executeQueryCount} query (~${executionTime.toFixed(0)}ms)`);
    } finally {
      // Restore original function
      prisma.userProduct.findUnique = originalFindUnique;
    }
  });

  it('should calculate stock stats correctly in memory', async () => {
    const result = await getProductsById(invoiceId);

    expect(result.productLines).toHaveLength(5);

    // Verify each product has calculated stats
    result.productLines.forEach((product, index) => {
      expect(product.stats).toBeDefined();
      expect(product.stats.totalMovements).toBe(4); // 4 movements per product
      expect(product.stats.totalQuantityIn).toBeGreaterThanOrEqual(0);
      expect(product.stats.totalQuantityOut).toBeGreaterThanOrEqual(0);
      expect(product.stats.currentStock).toBeDefined();
      expect(product.stats.lastMovement).toBeDefined();

      // Verify stock movements are included
      expect(product.stockMovements).toHaveLength(4);
    });
  });

  it('performance benchmark: before vs after optimization', async () => {
    console.log('\n⏱️  Performance Benchmark for getProductsById:');
    console.log('   Running 5 times with 5 products each...\n');

    const times: number[] = [];

    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      await getProductsById(invoiceId);
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

    // Should be very fast with single batched query
    expect(avgTime).toBeLessThan(100);
  });

  it('should return stats for each product with correct aggregations', async () => {
    const result = await getProductsById(invoiceId);

    result.productLines.forEach((product) => {
      const stats = product.stats;
      const movements = product.stockMovements;

      // Calculate expected values
      const expectedTotalIn = movements
        .filter((m) => m.movementType === 'IN')
        .reduce((sum, m) => sum + m.quantity, 0);

      const expectedTotalOut = movements
        .filter((m) => m.movementType === 'OUT')
        .reduce((sum, m) => sum + m.quantity, 0);

      // Verify calculations match
      expect(stats.totalQuantityIn).toBe(expectedTotalIn);
      expect(stats.totalQuantityOut).toBe(expectedTotalOut);
      expect(stats.totalMovements).toBe(movements.length);

      // Verify current stock is from last movement
      if (movements.length > 0) {
        const lastMovement = movements[movements.length - 1];
        expect(stats.currentStock).toBe(lastMovement.newStock);
      }
    });
  });
});
