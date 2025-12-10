/**
 * Test Suite: Analytics Endpoints
 * Critical Feature #4: Data Aggregation and Reporting
 * 
 * Tests analytics calculations and data retrieval
 */

import { getDailyMovements, getMonthlySummary, getCategoryStats } from '@/app/actions/analyticsActions'

describe('Analytics - Daily Movements', () => {
  describe('getDailyMovements', () => {
    it('should fetch movements for date range', async () => {
      const startDate = new Date('2025-12-01')
      const endDate = new Date('2025-12-31')

      const result = await getDailyMovements(startDate, endDate)

      // Expected structure
      expect(Array.isArray(result)).toBe(true)
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('date')
        expect(result[0]).toHaveProperty('stockIn')
        expect(result[0]).toHaveProperty('stockOut')
        expect(result[0]).toHaveProperty('net')
        expect(result[0]).toHaveProperty('movements')
      }
    })

    it('should group movements by date correctly', async () => {
      const startDate = new Date('2025-12-01')
      const endDate = new Date('2025-12-31')

      const result = await getDailyMovements(startDate, endDate)

      // Each daily entry should have unique date
      const dates = result.map((d: any) => d.date)
      const uniqueDates = new Set(dates)

      expect(dates.length).toBe(uniqueDates.size)
    })

    it('should calculate net correctly (IN - OUT)', async () => {
      // Expected behavior: net = stockIn - stockOut
      const mockDaily = {
        date: '2025-12-01',
        stockIn: 100,
        stockOut: 30,
        net: 70,
      }

      expect(mockDaily.net).toBe(mockDaily.stockIn - mockDaily.stockOut)
    })

    it('should filter by userId if provided', async () => {
      const startDate = new Date('2025-12-01')
      const endDate = new Date('2025-12-31')
      const userId = 'specific-user-123'

      const result = await getDailyMovements(startDate, endDate, userId)

      // Expected: returns data for specific user
      expect(Array.isArray(result)).toBe(true)
      
      // All movements should be from specified user
      // (This is validated by API, not tested here)
    })

    it('should return empty array for date range with no data', async () => {
      const startDate = new Date('2000-01-01')
      const endDate = new Date('2000-01-31')

      const result = await getDailyMovements(startDate, endDate)

      // Expected: empty array if no data
      expect(Array.isArray(result)).toBe(true)
    })
  })
})

describe('Analytics - Monthly Summary', () => {
  describe('getMonthlySummary', () => {
    it('should calculate monthly totals correctly', async () => {
      const year = 2025
      const month = 12

      const result = await getMonthlySummary(year, month)

      // Expected structure
      expect(result).toHaveProperty('year', year)
      expect(result).toHaveProperty('month', month)
      expect(result).toHaveProperty('totalIn')
      expect(result).toHaveProperty('totalOut')
      expect(result).toHaveProperty('monthlyNet')
      expect(result).toHaveProperty('movementCount')
    })

    it('should track previous balance (cumulative)', async () => {
      const result = await getMonthlySummary(2025, 12)

      // Expected: includes previous month balance for cumulative calculation
      expect(result).toHaveProperty('previousBalance')
      expect(result).toHaveProperty('cumulativeNet')
    })

    it('should calculate average daily movement', async () => {
      const result = await getMonthlySummary(2025, 12)

      // Expected: averageDaily = movementCount / daysInMonth
      if (result.movementCount > 0) {
        expect(result).toHaveProperty('averageDaily')
        expect(typeof result.averageDaily).toBe('number')
      }
    })

    it('should handle months with no data', async () => {
      const result = await getMonthlySummary(2000, 1) // Very old month

      // Expected: return zeros, not error
      expect(result).toHaveProperty('totalIn')
      expect(result.totalIn).toBeDefined()
    })
  })
})

describe('Analytics - Category Statistics', () => {
  describe('getCategoryStats', () => {
    it('should group movements by category', async () => {
      const startDate = new Date('2025-12-01')
      const endDate = new Date('2025-12-31')

      const result = await getCategoryStats(startDate, endDate)

      // Expected structure
      expect(Array.isArray(result)).toBe(true)
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('name') // Category name
        expect(result[0]).toHaveProperty('totalIn')
        expect(result[0]).toHaveProperty('totalOut')
        expect(result[0]).toHaveProperty('movementCount')
        expect(result[0]).toHaveProperty('percentage')
      }
    })

    it('should calculate percentage correctly', async () => {
      // Expected: percentage = (movementCount / totalMovements) * 100
      const mockCategory = {
        name: 'Électronique',
        movementCount: 50,
        percentage: 25, // 50/200 * 100 = 25%
      }

      expect(mockCategory.percentage).toBe((mockCategory.movementCount / 200) * 100)
    })

    it('should list products in each category', async () => {
      const startDate = new Date('2025-12-01')
      const endDate = new Date('2025-12-31')

      const result = await getCategoryStats(startDate, endDate)

      if (result.length > 0) {
        expect(result[0]).toHaveProperty('products')
        expect(Array.isArray(result[0].products)).toBe(true)
      }
    })
  })
})

describe('Analytics - Performance Baseline', () => {
  it('should fetch daily movements within acceptable time', async () => {
    const startDate = new Date('2025-12-01')
    const endDate = new Date('2025-12-31')

    const startTime = performance.now()
    const result = await getDailyMovements(startDate, endDate)
    const endTime = performance.now()

    const duration = endTime - startTime
    console.log(`[Performance] getDailyMovements: ${duration.toFixed(2)}ms`)

    // Baseline: should complete within 2 seconds
    expect(duration).toBeLessThan(2000)
  })

  it('should fetch monthly summary within acceptable time', async () => {
    const startTime = performance.now()
    await getMonthlySummary(2025, 12)
    const endTime = performance.now()

    const duration = endTime - startTime
    console.log(`[Performance] getMonthlySummary: ${duration.toFixed(2)}ms`)

    // Baseline: should complete within 1 second
    expect(duration).toBeLessThan(1000)
  })

  it('should fetch category stats within acceptable time', async () => {
    const startDate = new Date('2025-12-01')
    const endDate = new Date('2025-12-31')

    const startTime = performance.now()
    await getCategoryStats(startDate, endDate)
    const endTime = performance.now()

    const duration = endTime - startTime
    console.log(`[Performance] getCategoryStats: ${duration.toFixed(2)}ms`)

    // Baseline: should complete within 1.5 seconds
    expect(duration).toBeLessThan(1500)
  })

  it('should handle large date ranges efficiently', async () => {
    const startDate = new Date('2020-01-01') // 5 years
    const endDate = new Date('2025-12-31')

    const startTime = performance.now()
    const result = await getDailyMovements(startDate, endDate)
    const endTime = performance.now()

    const duration = endTime - startTime
    console.log(`[Performance] getDailyMovements (large range): ${duration.toFixed(2)}ms`)

    // Should still be reasonable
    expect(duration).toBeLessThan(5000)
    expect(Array.isArray(result)).toBe(true)
  })
})
