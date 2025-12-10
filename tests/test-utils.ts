import jwt from 'jsonwebtoken'

/**
 * Test utilities for common operations
 */

/**
 * Generate a test JWT token
 */
export const generateTestToken = (userId: string = 'test-user-123', role: 'ADMIN' | 'WORKER' = 'WORKER') => {
  return jwt.sign(
    {
      id: userId,
      email: 'test@example.com',
      name: 'Test User',
      role: role,
    },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  )
}

/**
 * Mock fetch responses
 */
export const mockFetchResponse = (data: any, status: number = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Map(),
  } as Response
}

/**
 * Create test user object
 */
export const createTestUser = (overrides = {}) => {
  return {
    id: 'user-123',
    username: 'testuser',
    passwordHash: '$2a$10$hashedpassword',
    name: 'Test User',
    email: 'test@example.com',
    role: 'WORKER' as const,
    ...overrides,
  }
}

/**
 * Create test product/invoice
 */
export const createTestInvoice = (overrides = {}) => {
  return {
    id: 'invoice-123',
    name: 'Test Invoice',
    createdAt: new Date('2025-12-01'),
    createdById: 'user-123',
    ...overrides,
  }
}

/**
 * Create test product line
 */
export const createTestProductLine = (overrides = {}) => {
  return {
    id: 'product-123',
    name: 'Test Product',
    quality: 3,
    category: 'Électronique',
    unitPrice: 99.99,
    initialStock: 100,
    currentStock: 50,
    minStock: 10,
    unite: 'Kg',
    userProductId: 'invoice-123',
    ...overrides,
  }
}

/**
 * Create test stock movement
 */
export const createTestStockMovement = (overrides = {}) => {
  return {
    id: 'movement-123',
    productLineId: 'product-123',
    movementType: 'OUT' as const,
    quantity: 10,
    previousStock: 60,
    newStock: 50,
    reason: 'STOCK_CONSUMPTION',
    userId: 'user-123',
    userProductId: 'invoice-123',
    createdAt: new Date('2025-12-01'),
    ...overrides,
  }
}

/**
 * Wait for async operation
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Performance timing utility
 */
export class Timer {
  private startTime: number = 0
  private name: string

  constructor(name: string = 'Operation') {
    this.name = name
  }

  start() {
    this.startTime = performance.now()
  }

  end() {
    const endTime = performance.now()
    const duration = endTime - this.startTime
    console.log(`[${this.name}] Completed in ${duration.toFixed(2)}ms`)
    return duration
  }
}
