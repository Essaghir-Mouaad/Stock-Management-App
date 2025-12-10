# Rollback Plan: Phase 1 - Database Optimization

**Phase**: 1 - Database Indexing and Query Optimization  
**Expected Duration**: 8 hours  
**Severity**: Medium  
**Risk Level**: Low-Medium

---

## 📋 Summary

Phase 1 focuses on improving database performance through:

- Adding missing indexes on frequently queried columns
- Fixing over-fetching by implementing `select()` statements
- Implementing response caching for hot queries

## 🎯 Changes in This Phase

### Database Changes

- Add indexes on: `User.email`, `User.createdAt`, `ProductLine.userProductId`
- Add composite indexes on common WHERE clauses
- Update Prisma schema with better relations

### Code Changes

- Update `productActions.ts` to use `select()` for specific fields
- Implement Redis caching for analytics queries
- Cache invalidation logic

### Migration

- Create Prisma migration: `add_missing_indexes`
- Run migration: `npx prisma migrate deploy`

---

## 🔄 Rollback Procedure

### Step 1: Code Rollback

```bash
# Navigate to project root
cd "d:\summer_intership\Stock-Management-App - Copy"

# Identify commits to revert
git log --oneline | grep -E "optimize/db|refactor/query" | head -10

# Revert all Phase 1 commits
git revert <oldest-commit-hash>..<newest-commit-hash>

# Or revert specific branch
git revert -m 1 <merge-commit-hash>

# Verify revert
git log --oneline | head -5

# Push reverted changes
git push origin <branch-name>
```

### Step 2: Database Migration Rollback

```bash
# Check migration status
npx prisma migrate status

# Resolve the migration as rolled back
npx prisma migrate resolve --rolled-back add_missing_indexes

# Verify rollback
npx prisma migrate status

# Push database schema back to previous state
npx prisma db push
```

### Step 3: Cache Invalidation

```bash
# Clear Redis cache (if implemented)
redis-cli FLUSHALL

# Or via Node script
npm run cache:clear

# Clear Next.js cache
rm -rf .next

# Clear Prisma cache
rm -rf prisma/.cache
```

### Step 4: Application Restart

```bash
# Kill running processes
npm run stop

# Clean dependencies cache
npm cache clean --force

# Reinstall dependencies
npm install

# Run database setup
npx prisma generate
npx prisma db push

# Start application
npm run dev
```

### Step 5: Verification

```bash
# Run all tests
npm test

# Expected: All 72 tests should pass
# If tests fail: Check database state

# Run benchmarks to verify performance reverted to baseline
npx ts-node tests/benchmarks.ts

# Compare with baseline
# Performance should be close to BASELINE_METRICS.md

# Check application logs
npm run dev 2>&1 | head -50

# Test key features
curl http://localhost:3000/api/products     # Should work
curl http://localhost:3000/api/auth/login   # Should work
```

---

## ✅ Rollback Verification Checklist

### Code Level

- [ ] All commits reverted
- [ ] No references to Phase 1 changes remain
- [ ] `.gitignore` and config files unchanged

### Database Level

- [ ] Migration marked as rolled back
- [ ] Database schema reverted to previous state
- [ ] No orphaned tables or columns
- [ ] Prisma schema aligned with database

### Application Level

- [ ] Application starts without errors
- [ ] All 72 tests pass
- [ ] No console errors in logs
- [ ] API endpoints responding

### Performance Level

- [ ] Performance metrics near baseline
- [ ] No unexpected query slowdowns
- [ ] Cache is clear

### Data Level

- [ ] No data loss
- [ ] User data intact
- [ ] Invoices and movements accessible
- [ ] Analytics data preserved

---

## 🆘 Rollback Issues

### Issue: Migration Rollback Failed

**Symptoms**: `npx prisma migrate resolve` shows error

**Solution**:

```bash
# Option 1: Force rollback (use with caution)
rm prisma/migrations/add_missing_indexes
npx prisma migrate status

# Option 2: Manual database reset (WARNING: Data loss)
npx prisma migrate reset

# Option 3: Check Prisma status
npx prisma db execute --stdin < previous-schema.sql
```

### Issue: Tests Still Failing After Rollback

**Symptoms**: Tests fail even after code revert

**Solution**:

```bash
# Clear Jest cache
npm test -- --clearCache

# Reset test database
rm test.db

# Reinstall dependencies
npm install

# Run tests again
npm test
```

### Issue: Application Won't Start

**Symptoms**: `npm run dev` fails

**Solution**:

```bash
# Check Node version
node --version

# Check npm packages
npm ls prisma

# Rebuild native modules
npm rebuild

# Clear all caches
npm cache clean --force
rm -rf .next node_modules

# Reinstall everything
npm install

# Try again
npm run dev
```

### Issue: Performance Still Degraded

**Symptoms**: Queries still slow after rollback

**Solution**:

```bash
# Check for old index remnants
npx prisma db execute --stdin << 'EOF'
SELECT * FROM sqlite_master WHERE type='index';
EOF

# Drop old indexes (PostgreSQL/MySQL)
DROP INDEX IF EXISTS idx_user_email;

# Recreate baseline indexes
npx prisma db push

# Run benchmarks
npx ts-node tests/benchmarks.ts
```

---

## 📊 Success Criteria

After successful rollback, verify:

| Criteria      | Expected Result         | Actual Result |
| ------------- | ----------------------- | ------------- |
| Code Reverted | No Phase 1 code remains | ☐             |
| Tests Pass    | All 72 tests passing    | ☐             |
| Performance   | Close to baseline (±5%) | ☐             |
| Database      | Aligned with schema     | ☐             |
| Application   | Starts without errors   | ☐             |
| Logs          | No error messages       | ☐             |

---

## 📝 Rollback Documentation

### If Rollback Occurs

Document the following in a new file `docs/rollback-reports/phase1-rollback-report.md`:

```markdown
# Phase 1 Rollback Report

**Date**: [date]
**Time**: [time]
**Duration**: [duration]
**Performed By**: [name]

## Root Cause

[Why was rollback needed?]

## What Went Wrong

[Specific issue encountered]

## Rollback Actions Taken

1. [Action]
2. [Action]

## Verification Results

- Tests: ✅ PASS
- Performance: ✅ Baseline ±5%
- Data: ✅ Intact

## Post-Rollback Analysis

[Lessons learned and recommendations]

## Next Steps

[How to prevent this issue in future attempts]
```

---

## 🔗 Related Documents

- `docs/DEVELOPMENT_WORKFLOW.md` - Main workflow guide
- `BASELINE_METRICS.md` - Performance baseline
- `PERFORMANCE_ISSUES.md` - Optimization roadmap
- `TESTING_INFRASTRUCTURE.md` - Testing guidelines

---

## 📞 Support

If rollback is needed:

1. Check this document first
2. Review "Rollback Issues" section
3. Document actions taken
4. Create rollback report
5. Discuss with team before attempting Phase 2 again

---

**Created**: December 10, 2025  
**Last Updated**: December 10, 2025  
**Status**: Ready for Phase 1 Implementation
