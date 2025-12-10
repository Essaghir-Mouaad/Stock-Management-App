import { PrismaClient } from '@prisma/client'

/**
 * Test database configuration
 * Uses an in-memory or separate test database
 */

// Create a test-specific Prisma client
export const prismaMock = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./test.db',
    },
  },
})

/**
 * Setup test database before all tests
 */
export const setupTestDatabase = async () => {
  try {
    // Push schema to test database
    await prismaMock.$executeRawUnsafe('SELECT 1')
    console.log('✓ Test database connection successful')
  } catch (error) {
    console.error('✗ Test database connection failed:', error)
    throw error
  }
}

/**
 * Cleanup test database after tests
 */
export const cleanupTestDatabase = async () => {
  try {
    // Clear all tables
    await prismaMock.stockMovement.deleteMany({})
    await prismaMock.productLine.deleteMany({})
    await prismaMock.userProduct.deleteMany({})
    await prismaMock.user.deleteMany({})
    console.log('✓ Test database cleanup successful')
  } catch (error) {
    console.error('✗ Test database cleanup failed:', error)
  } finally {
    await prismaMock.$disconnect()
  }
}

/**
 * Reset specific tables
 */
export const resetTable = async (tableName: keyof PrismaClient) => {
  try {
    if (tableName === 'stockMovement') {
      await prismaMock.stockMovement.deleteMany({})
    } else if (tableName === 'productLine') {
      await prismaMock.productLine.deleteMany({})
    } else if (tableName === 'userProduct') {
      await prismaMock.userProduct.deleteMany({})
    } else if (tableName === 'user') {
      await prismaMock.user.deleteMany({})
    }
  } catch (error) {
    console.error(`Failed to reset table ${tableName}:`, error)
  }
}

export default prismaMock
