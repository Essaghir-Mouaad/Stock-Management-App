# Testing Infrastructure Setup Guide

This document describes the testing infrastructure created for the Stock Management App. All code is on the `setup/testing-infrastructure` branch.

## 📋 Overview

The testing infrastructure includes:

- **Jest Configuration** - Test runner with Next.js support
- **Database Test Utilities** - Isolated test database with setup/teardown
- **Test Helpers** - Factory functions and mock utilities
- **Baseline Test Suites** - 84 test cases covering 5 critical features
- **Performance Benchmarks** - Performance measurement infrastructure

## 📁 File Structure

```
tests/
├── db-setup.ts              # Database connection and cleanup utilities
├── test-utils.ts            # Helper factories, timers, and mock utilities
├── auth.test.ts             # Authentication tests (16 cases)
├── products.test.ts         # Product CRUD tests (14 cases)
├── stock-movement.test.ts   # Stock movement tests (16 cases)
├── analytics.test.ts        # Analytics query tests (20 cases)
├── api-errors.test.ts       # API error handling tests (18 cases)
└── benchmarks.ts            # Performance benchmarking script

jest.config.js              # Jest configuration
jest.setup.js               # Test environment setup
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  supertest \
  @types/jest \
  @types/supertest \
  ts-jest \
  @types/node
```

### 2. Verify Database Configuration

Ensure `.env.local` has test database:

```env
DATABASE_URL="file:./test.db"
```

Or the script will use the test database automatically.

### 3. Run Baseline Tests

```bash
npm test
```

This runs all test suites and verifies current behavior passes with existing code.

### 4. Generate Baseline Metrics

```bash
npx ts-node tests/benchmarks.ts
```

This generates `BASELINE_METRICS.md` with performance measurements for:

- Database queries (getInvoiceProductByEmail, getDailyMovements, etc.)
- API endpoints (login, product creation, stock movement, analytics)
- Component rendering (GlobalDashboard, ProductGrid, etc.)
- Data aggregation (grouping, yearly reports, N+1 patterns)

## 📊 Test Suites Overview

### Authentication Tests (16 cases)

**File:** `tests/auth.test.ts`

Tests login and registration functionality:

- Successful login with valid credentials
- Login validation errors
- Login with non-existent user
- Register new user
- Register with duplicate email
- Register validation errors
- JWT token generation and expiration
- Performance timing for bcrypt operations

**Expected:** All tests PASS with current code

### Product CRUD Tests (14 cases)

**File:** `tests/products.test.ts`

Tests product and invoice management:

- Create invoice with products
- Fetch all invoices for user
- Fetch single invoice with nested products
- Update invoice (only workers can modify)
- Delete invoice (admin only)
- Nested ProductLine relations
- Validation for missing fields
- Performance timing for large invoice fetches

**Expected:** All tests PASS with current code

### Stock Movement Tests (16 cases)

**File:** `tests/stock-movement.test.ts`

Tests stock tracking functionality:

- Worker creates OUT movements
- Admin creates IN movements
- Admin creates ADJUSTMENT movements
- Stock quantity updates correctly
- User cannot modify other's movements
- Invalid movement types rejected
- Movements appear in daily tracking
- Performance timing for batch operations

**Expected:** All tests PASS with current code

### Analytics Tests (20 cases)

**File:** `tests/analytics.test.ts`

Tests analytics and reporting:

- Daily movements aggregation
- Monthly summary calculation
- Category statistics grouping
- Product performance ranking
- Date range filtering
- Cumulative calculations
- Performance timing for large date ranges (5-year spans)
- Aggregation accuracy with 1000+ movements

**Expected:** All tests PASS with current code

### API Error Handling Tests (18 cases)

**File:** `tests/api-errors.test.ts`

Tests HTTP error handling:

- 401 Unauthorized responses
- 403 Forbidden responses
- 404 Not found responses
- 400 Bad request for validation errors
- 500 Internal server errors
- Error message structure
- Error code mapping
- Request validation before database operations

**Expected:** All tests PASS with current code

## 🔧 Test Utilities

### Database Setup (`tests/db-setup.ts`)

```typescript
import { dbSetup, dbTeardown, resetDatabase } from "./db-setup";

// In test file:
beforeAll(async () => {
  await dbSetup();
});

afterEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await dbTeardown();
});
```

**Functions:**

- `dbSetup()` - Initialize test database connection
- `dbTeardown()` - Close database connection
- `resetDatabase()` - Clear all tables, reset state

### Test Helpers (`tests/test-utils.ts`)

```typescript
import {
  createTestUser,
  createTestInvoice,
  createTestStockMovement,
  Timer,
  generateToken,
  mockApiResponse,
} from "./test-utils";

// Create test data
const user = await createTestUser({
  email: "test@example.com",
  role: "WORKER",
});
const invoice = await createTestInvoice({ userId: user.id });
const movement = await createTestStockMovement({
  userProductId: invoice.id,
  movementType: "OUT",
  quantity: 10,
});

// Measure performance
const timer = new Timer();
const result = await someAsyncOperation();
console.log(`Operation took ${timer.elapsed()}ms`);

// Generate tokens
const token = generateToken(user);

// Mock responses
const mockResponse = mockApiResponse({ status: 200, body: { success: true } });
```

**Available Functions:**

- `createTestUser(data)` - Create user with defaults
- `createTestInvoice(data)` - Create invoice with products
- `createTestProductLine(data)` - Create product line
- `createTestStockMovement(data)` - Create stock movement
- `Timer` - Measure operation duration
- `generateToken(user)` - Generate JWT token
- `mockApiResponse(config)` - Create mock response

## 📈 Performance Benchmarks

The benchmarks measure realistic performance scenarios:

### Current Baseline Expectations

| Operation                      | Target Time | Notes                          |
| ------------------------------ | ----------- | ------------------------------ |
| User Login                     | < 100ms     | bcrypt is slow by design       |
| Create Invoice                 | < 100ms     | DB write + fetch               |
| Stock Movement                 | < 100ms     | Update stock + create movement |
| Daily Movements (30d)          | < 200ms     | Aggregation query              |
| Analytics Overview             | < 200ms     | Multiple aggregations          |
| Category Stats                 | < 250ms     | Grouping by category           |
| Monthly Summary                | < 150ms     | Two aggregation queries        |
| Product Performance            | < 200ms     | Ranking by movement            |
| Dashboard Load (3 APIs)        | < 500ms     | Parallel requests              |
| ProductGrid Render (100 items) | < 50ms      | React render                   |

**Generate Benchmark Report:**

```bash
npx ts-node tests/benchmarks.ts
```

This creates `BASELINE_METRICS.md` with:

- Average, min, and max times
- Slowest and fastest operations
- Comparison between optimized and non-optimized approaches

## 📝 Expected Test Results

### Before Running Tests

1. Verify database connection works: `npx prisma db push`
2. Check `.env.local` has correct DATABASE_URL
3. Ensure test database file permissions allow writes

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/auth.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode (re-run on file changes)
npm test -- --watch

# Verbose output
npm test -- --verbose
```

### Expected Output

```
 PASS  tests/auth.test.ts (1.234 s)
   User Authentication
     ✓ should login with valid credentials (45ms)
     ✓ should reject invalid email (5ms)
     ✓ should hash password correctly (82ms)
     ...

 PASS  tests/products.test.ts (2.456 s)
   Product Management
     ✓ should create invoice with products (67ms)
     ✓ should fetch invoice with nested relations (34ms)
     ...

Test Suites: 5 passed, 5 total
Tests: 84 passed, 84 total
Time: 8.234 s
```

## 🔍 Understanding Test Structure

### Typical Test Layout

```typescript
describe("Feature Name", () => {
  let testUser: User;

  beforeAll(async () => {
    await dbSetup();
  });

  beforeEach(async () => {
    // Reset DB and create fresh test data
    await resetDatabase();
    testUser = await createTestUser();
  });

  afterAll(async () => {
    await dbTeardown();
  });

  it("should perform specific action", async () => {
    // Test code
    // 1. Setup (usually done in beforeEach)
    // 2. Action
    const result = await someOperation();

    // 3. Assert
    expect(result).toBe(expectedValue);
  });

  it("should measure performance", async () => {
    const timer = new Timer();
    const result = await someAsyncOperation();

    // Verify performance
    expect(timer.elapsed()).toBeLessThan(1000); // < 1 second
  });
});
```

### Test Naming Conventions

- Test names describe the behavior being tested
- Use "should" to describe expected behavior
- Include context: `should create invoice with correct user association`
- Performance tests include timing in description

## ⚠️ Important Notes

### Test Database Isolation

Each test suite:

1. Initializes fresh database connection
2. Resets tables before each test
3. Cleans up after all tests complete

This ensures:

- Tests don't interfere with each other
- No data persists between runs
- Developers can run tests repeatedly

### Environment Variables

Tests use mock environment variables set in `jest.setup.js`:

```javascript
process.env.JWT_SECRET = "test-secret";
process.env.DATABASE_URL = "file:./test.db";
```

**DO NOT** use production database for testing.

### TypeScript Configuration

Tests require `tsconfig.json` to include test files:

```json
{
  "include": ["app/**/*", "tests/**/*"]
}
```

## 🚀 Next Steps (After Review)

Once testing infrastructure is approved:

### Phase 1: Run Tests & Generate Metrics

```bash
npm test
npx ts-node tests/benchmarks.ts
```

### Phase 2: Performance Optimization (Priority: HIGH)

- Add missing database indexes
- Fix N+1 query patterns (overFetch issues)
- Implement caching layer
- Optimize API response times

### Phase 3: Re-run Tests & Verify

```bash
npm test        # Verify no regressions
npm test -- --coverage  # Check coverage
```

### Phase 4: Measure Improvement

Compare baseline metrics against optimized metrics in `BASELINE_METRICS.md`.

## 📚 Related Documentation

- **ANALYSIS.md** - Complete codebase analysis
- **PERFORMANCE_ISSUES.md** - Detailed list of 47 performance issues with effort estimates
- **BASELINE_METRICS.md** - Generated after running benchmarks

## ❓ Troubleshooting

### Tests fail with "Cannot find module"

```bash
npm install
npm test
```

### Database connection errors

Check:

1. `.env.local` has `DATABASE_URL=file:./test.db`
2. Directory is writable
3. Run `npx prisma db push` to create schema

### Performance tests are slow

- This is normal for first run
- Use `--testTimeout=10000` to increase timeout
- Benchmarks run multiple iterations for accuracy

### Tests pass but benchmarks fail

- Benchmarks require async/await support
- Ensure Node.js version >= 14
- Check system load (other processes may affect timing)

## 📞 Support

For issues with testing infrastructure:

1. Check test output for error messages
2. Review PERFORMANCE_ISSUES.md for context
3. Verify environment setup in jest.setup.js
4. Run individual test file to isolate issues

---

**Branch:** `setup/testing-infrastructure`
**Status:** Ready for review before proceeding to optimization phase
**Last Updated:** [Current Date]
