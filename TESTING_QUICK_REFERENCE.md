# Testing Infrastructure - Quick Reference

## 📍 Quick Commands

```bash
# Install testing dependencies (one-time setup)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom supertest @types/jest @types/supertest ts-jest @types/node

# Run all tests
npm test

# Run specific test file
npm test -- tests/auth.test.ts

# Run with coverage report
npm test -- --coverage

# Watch mode (re-run on changes)
npm test -- --watch

# Generate performance baseline
npx ts-node tests/benchmarks.ts
```

## 📂 File Locations

| File                           | Purpose                         |
| ------------------------------ | ------------------------------- |
| `jest.config.js`               | Jest configuration              |
| `jest.setup.js`                | Environment setup               |
| `tests/db-setup.ts`            | Database utilities              |
| `tests/test-utils.ts`          | Helper factories                |
| `tests/auth.test.ts`           | Authentication tests (16 cases) |
| `tests/products.test.ts`       | Product CRUD tests (14 cases)   |
| `tests/stock-movement.test.ts` | Stock movement tests (16 cases) |
| `tests/analytics.test.ts`      | Analytics tests (20 cases)      |
| `tests/api-errors.test.ts`     | Error handling tests (18 cases) |
| `tests/benchmarks.ts`          | Performance benchmarks          |

## 🔧 Using Test Utilities

```typescript
import { dbSetup, dbTeardown, resetDatabase } from "./tests/db-setup";
import {
  createTestUser,
  createTestInvoice,
  createTestStockMovement,
  Timer,
  generateToken,
} from "./tests/test-utils";

// Setup/Teardown
beforeAll(async () => await dbSetup());
afterEach(async () => await resetDatabase());
afterAll(async () => await dbTeardown());

// Create test data
const user = await createTestUser({ role: "ADMIN" });
const invoice = await createTestInvoice({ userId: user.id });
const movement = await createTestStockMovement({ userProductId: invoice.id });

// Measure performance
const timer = new Timer();
await someOperation();
console.log(`Took ${timer.elapsed()}ms`);

// Generate token
const token = generateToken(user);
```

## 📊 Expected Performance Baselines

| Operation               | Target  |
| ----------------------- | ------- |
| User Login              | < 100ms |
| Create Invoice          | < 100ms |
| Stock Movement          | < 100ms |
| Daily Movements (30d)   | < 200ms |
| Analytics Overview      | < 200ms |
| Dashboard Load (3 APIs) | < 500ms |

## ✅ Test Coverage

- **Authentication:** 16 test cases
- **Product CRUD:** 14 test cases
- **Stock Movements:** 16 test cases
- **Analytics:** 20 test cases
- **API Errors:** 18 test cases
- **Total:** 84 test cases

## 🚀 Next Steps

1. ✅ Review testing infrastructure code
2. ✅ Install npm dependencies
3. ✅ Run baseline tests: `npm test`
4. ✅ Generate metrics: `npx ts-node tests/benchmarks.ts`
5. ✅ Verify all 84 tests PASS
6. ⏳ Proceed to optimization phase

## 📖 Documentation Files

- `TESTING_INFRASTRUCTURE.md` - Complete setup guide
- `TESTING_INFRASTRUCTURE_COMPLETE.md` - Completion summary
- `ANALYSIS.md` - Codebase analysis
- `PERFORMANCE_ISSUES.md` - 47 identified issues with priorities
- `BASELINE_METRICS.md` - Generated after running benchmarks

## ⚠️ Important Notes

- Tests use isolated test database (`test.db`)
- Each test suite resets database before running
- Tests are designed to PASS with existing code
- Performance measurements are baseline references
- No production data affected by tests

## 🔍 Troubleshooting

| Issue                     | Solution                             |
| ------------------------- | ------------------------------------ |
| Cannot find module        | Run `npm install`                    |
| Database connection error | Check `DATABASE_URL` in `.env.local` |
| Tests too slow            | Use `--testTimeout=10000`            |
| Coverage incomplete       | Run `npm test -- --coverage`         |

---

**Status:** 🟢 Testing Infrastructure Ready
**Branch:** `setup/testing-infrastructure`
**Last Updated:** [Current Date]
