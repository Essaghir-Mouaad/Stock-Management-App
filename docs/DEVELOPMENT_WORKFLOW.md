# Development Workflow - Optimization Project

**Project**: Stock Management Application Performance Optimization  
**Branch Strategy**: Feature branches with squash merges  
**Git Workflow**: Git Flow adapted for optimization phases

---

## 📋 Table of Contents

1. [Branch Naming Convention](#branch-naming-convention)
2. [Commit Message Template](#commit-message-template)
3. [Pre-commit Checklist](#pre-commit-checklist)
4. [Rollback Documentation](#rollback-documentation)
5. [Optimization Phases](#optimization-phases)
6. [Best Practices](#best-practices)

---

## 🌿 Branch Naming Convention

### Format

```
<type>/<area>-<description>
```

### Types

| Type        | Purpose                    | Example                          |
| ----------- | -------------------------- | -------------------------------- |
| `optimize/` | Performance improvements   | `optimize/db-query-indexing`     |
| `refactor/` | Code restructuring         | `refactor/api-response-caching`  |
| `test/`     | Test coverage improvements | `test/analytics-coverage`        |
| `fix/`      | Bug fixes                  | `fix/n-plus-one-query-movements` |
| `docs/`     | Documentation updates      | `docs/optimization-roadmap`      |

### Areas

| Area        | Scope                                     |
| ----------- | ----------------------------------------- |
| `db`        | Database operations, indexing, migrations |
| `query`     | Query optimization, aggregations          |
| `api`       | API endpoints, response handling          |
| `frontend`  | React components, re-renders              |
| `auth`      | Authentication, authorization             |
| `analytics` | Analytics queries, reporting              |
| `cache`     | Caching layers, redis                     |
| `other`     | Cross-cutting concerns                    |

### Examples

✅ **Good Branch Names**

```
optimize/db-query-indexing
optimize/api-response-caching
refactor/analytics-aggregation
test/stock-movement-coverage
fix/n-plus-one-invoices
docs/performance-roadmap
```

❌ **Bad Branch Names**

```
fix/bug                    # Too vague
optimize-db               # Missing area
my-changes                # No type
feature123                # No description
```

### Creating a Branch

```bash
# Create and checkout new branch
git checkout -b optimize/db-query-indexing

# Push to remote
git push -u origin optimize/db-query-indexing

# Track branch for performance
git branch -m optimize/db-query-indexing

# Verify branch created
git branch -v
```

---

## 💬 Commit Message Template

### Setup Git Message Template

```bash
# Configure git to use the template
git config commit.template .gitmessage
```

### Template Format

```
Type: Area - Brief description (50 chars max)

Detailed description explaining the change.
Wrap at 72 characters for readability.

Type: [optimize|refactor|test|fix|docs]
Area: [db|query|api|frontend|auth|analytics|other]
Performance Impact: [none|low|medium|high|measured]

Performance Metrics (if applicable):
Before: [operation] took Xms
After:  [operation] takes Yms
Improvement: X% faster

Breaking Changes: [yes|no]
Migration Required: [yes|no]
Tests Updated: [yes|no]

Affected Files:
- app/actions/productActions.ts
- tests/products.test.ts

Rollback Instructions:
1. git revert <commit-hash>
2. npx prisma migrate resolve --rolled-back <migration>
3. npm test

Notes:
Added index on (email, createdAt) in User table
for faster invoice queries.

References: #123 (if applicable)
```

### Example Commits

**Optimization Commit**

```
optimize: db - Add index on user email for invoice queries

Added composite index (email, createdAt) to User model.
This improves getInvoiceProductByEmail query from 150ms to 12ms.

Type: optimize
Area: db
Performance Impact: measured

Before: getInvoiceProductByEmail took 150ms
After:  getInvoiceProductByEmail takes 12ms
Improvement: 92% faster

Tests Updated: yes
Migration Required: yes

Affected Files:
- prisma/schema.prisma
- prisma/migrations/[timestamp]_add_user_email_index/
- tests/products.test.ts

Rollback Instructions:
1. git revert <hash>
2. npx prisma migrate resolve --rolled-back add_user_email_index
3. npm test
```

**Test Coverage Commit**

```
test: analytics - Add coverage for category stats

Added 8 new test cases for getCategoryStats to increase coverage
from 60% to 85% for analytics module.

Type: test
Area: analytics
Performance Impact: none

Tests Updated: yes

Affected Files:
- tests/analytics.test.ts

References: #45
```

### Commit Best Practices

✅ **DO**

- Write clear, descriptive commit messages
- Include performance metrics when relevant
- Keep commits focused on single changes
- Reference issues/PRs when applicable
- Explain the "why", not just the "what"

❌ **DON'T**

- Use vague messages ("fix stuff", "updates")
- Mix multiple concerns in one commit
- Skip the template
- Commit without running pre-checks
- Include unrelated changes

---

## ✅ Pre-commit Checklist

### Automated Pre-commit Script

Located at: `scripts/pre-commit-check.ts`

**Runs the following checks:**

1. ✅ **All Tests Pass** - Ensures no regressions
2. ✅ **No Console Logs** - Removes debug statements in production code
3. ✅ **Linting Passes** - ESLint compliance
4. ✅ **Git Status Clean** - Verifies staged changes
5. ✅ **TypeScript Compilation** - No type errors
6. ✅ **Performance Baseline** - Warns about needed benchmarks

### Running Pre-commit Checks

```bash
# Option 1: Manual run
npm run pre-commit-check

# Option 2: TypeScript runner
npx tsx scripts/pre-commit-check.ts

# Option 3: Bash script
./scripts/pre-commit-check.sh
```

### Setup as Git Hook (Optional)

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run pre-commit-check
EOF

# Make executable
chmod +x .git/hooks/pre-commit
```

### What Gets Checked

| Check        | Failure Behavior | Warning Behavior     |
| ------------ | ---------------- | -------------------- |
| Tests        | Blocks commit    | -                    |
| Console Logs | Blocks commit    | -                    |
| Linting      | Blocks commit    | -                    |
| TypeScript   | Blocks commit    | -                    |
| Git Status   | -                | Warns of changes     |
| Performance  | -                | Reminds to benchmark |

### Example Output

```
============================================================
  Pre-Commit Checklist - Optimization
  Stock Management Application
============================================================

CHECK 1: Running Tests
✓ Tests Pass
  ✅ All tests passed

CHECK 2: Console Statements
✓ No Console Logs
  ✅ No console.log statements found in production code

CHECK 3: Linting
✓ Linting
  ✅ ESLint passed

CHECK 4: Git Status
⚠ Git Status
  ⚠️ 3 file(s) changed - verify staged for commit

CHECK 5: TypeScript Compilation
✓ TypeScript
  ✅ TypeScript compilation successful

CHECK 6: Performance Baseline Check
⚠ Performance Baseline
  ⚠️ Run performance tests after commit to verify no regression

============================================================
SUMMARY

Passed: 5
Warnings: 2

✅ All pre-commit checks passed - Ready to commit!
```

---

## 🔄 Rollback Documentation

### Template: ROLLBACK_TEMPLATE.md

```markdown
# Rollback Plan: [Optimization Name]

**Date**: [Date]
**Branch**: [branch-name]
**Commit(s)**: [commit-hash(es)]
**Severity**: [Low|Medium|High|Critical]

## Summary

Brief description of what was changed.

## Reason for Rollback

[If needed]

## Rollback Steps

### Step 1: Code Rollback

\`\`\`bash

# Revert the commit(s)

git revert <commit-hash>

# or for multiple commits

git revert <oldest-commit-hash>..<newest-commit-hash>

# Push reverted changes

git push origin <branch-name>
\`\`\`

### Step 2: Database Rollback (if applicable)

\`\`\`bash

# For Prisma migrations

npx prisma migrate resolve --rolled-back <migration-name>

# Verify rollback

npx prisma migrate status
\`\`\`

### Step 3: Cache Invalidation

\`\`\`bash

# Clear application cache

npm run cache:clear

# Restart services if needed

npm run start
\`\`\`

### Step 4: Verification

\`\`\`bash

# Run all tests

npm test

# Check performance didn't degrade

npx ts-node tests/benchmarks.ts

# Verify application health

curl http://localhost:3000/health
\`\`\`

## Verification Checklist

- [ ] Code reverted successfully
- [ ] Database migrations rolled back
- [ ] All tests passing
- [ ] Performance metrics verified
- [ ] No errors in application logs
- [ ] User-facing functionality working
- [ ] Backups created (if needed)

## Communication

- [ ] Notify team of rollback
- [ ] Update issue tracker
- [ ] Document root cause
- [ ] Plan re-implementation if needed

## Logs

\`\`\`
[Paste relevant logs here]
\`\`\`
```

### Rollback Examples

#### Example 1: Database Index Rollback

```markdown
# Rollback Plan: Remove Incorrect Email Index

**Date**: 2025-12-15
**Branch**: optimize/db-email-index
**Commit**: abc123def456
**Severity**: High

## Summary

Added index on User.email broke unique constraint.

## Rollback Steps

### Step 1: Code Rollback

\`\`\`bash
git revert abc123def456
git push origin optimize/db-email-index
\`\`\`

### Step 2: Database Rollback

\`\`\`bash
npx prisma migrate resolve --rolled-back add_user_email_index
npx prisma db push
\`\`\`

### Step 3: Verification

\`\`\`bash
npm test
\`\`\`
```

#### Example 2: API Response Caching Rollback

```markdown
# Rollback Plan: Remove Redis Caching

**Date**: 2025-12-16
**Branch**: refactor/api-caching
**Commit**: def456abc789
**Severity**: Medium

## Summary

Redis caching implementation causing stale data issues.

## Rollback Steps

### Step 1: Code Rollback

\`\`\`bash
git revert def456abc789
git push origin refactor/api-caching
\`\`\`

### Step 2: Cache Invalidation

\`\`\`bash
npm run cache:clear
redis-cli FLUSHALL
\`\`\`

### Step 3: Verification

\`\`\`bash
npm test
npm run test:e2e
\`\`\`
```

---

## 🚀 Optimization Phases

### Phase 1: Database Optimization (8 hours)

**Branch Strategy**

```bash
git checkout -b optimize/db-indexing-and-queries
```

**Commits**

```
1. optimize: db - Add missing indexes on User, ProductLine
2. optimize: query - Fix over-fetching in getInvoiceProductByEmail
3. optimize: query - Implement select() to reduce payload
```

**Rollback Plan**

- Create `docs/rollback/phase1-db-optimization.md`
- Document index removal
- Database migration rollback

### Phase 2: Query Optimization (6 hours)

**Branch Strategy**

```bash
git checkout -b optimize/query-aggregation
```

**Commits**

```
1. optimize: query - Fix N+1 in product movements
2. optimize: query - Batch analytics aggregations
3. optimize: query - Add caching for category stats
```

### Phase 3: Frontend Optimization (6 hours)

**Branch Strategy**

```bash
git checkout -b refactor/component-memoization
```

**Commits**

```
1. refactor: frontend - Memoize GlobalDashboard
2. refactor: frontend - Lazy load ProductGrid
3. test: frontend - Add performance metrics
```

### Phase 4: Hardening (8 hours)

**Branch Strategy**

```bash
git checkout -b refactor/add-validation-layer
```

**Commits**

```
1. refactor: api - Add input validation
2. refactor: db - Add transaction wrapper
3. refactor: logging - Add error tracking
```

---

## 📊 Performance Tracking

### Before/After Measurement

Each optimization should document performance improvement:

```bash
# Before optimization
npm test
npx ts-node tests/benchmarks.ts > BASELINE_METRICS.md

# Make changes
# Test changes
npm test

# After optimization
npx ts-node tests/benchmarks.ts > OPTIMIZED_METRICS.md

# Compare
diff BASELINE_METRICS.md OPTIMIZED_METRICS.md
```

### Commit Performance Metrics

Always include in commit message:

```
Before: getInvoiceProductByEmail took 150ms (3 queries)
After:  getInvoiceProductByEmail takes 12ms (1 query)
Improvement: 92% faster, 60% fewer queries
```

---

## 👥 Best Practices

### Code Review Checklist

Before merging, verify:

- [ ] Tests pass
- [ ] Linting passes
- [ ] Performance improved (if optimization)
- [ ] No breaking changes (or documented)
- [ ] Rollback plan documented
- [ ] Code follows style guide
- [ ] Comments explain complex logic
- [ ] Performance metrics included

### Commit Frequency

✅ **DO**

- Commit frequently (every logical change)
- Keep commits small and focused
- One feature/fix per commit
- Squash related commits before merging

❌ **DON'T**

- Make one giant commit per phase
- Mix unrelated changes
- Commit incomplete work
- Skip testing between commits

### Branch Management

```bash
# Keep branch up to date
git fetch origin
git rebase origin/main

# Clean up old branches
git branch -d <branch-name>
git push origin --delete <branch-name>

# List local branches
git branch -v

# List remote branches
git branch -r
```

### Collaborative Development

```bash
# Pull latest changes
git pull origin <branch-name>

# Resolve conflicts
git status
git merge --abort  # if needed

# Push changes
git push origin <branch-name>

# Create pull request on GitHub
# Link to issue, reference metrics
```

---

## 🔍 Troubleshooting

### Merge Conflicts

```bash
# Identify conflicts
git status

# View conflict
git diff

# Use merge tool
git mergetool

# Or manually edit, then:
git add <resolved-files>
git commit -m "Resolved merge conflicts"
```

### Accidental Commit

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Edit last commit message
git commit --amend -m "New message"
```

### Branch Mistakes

```bash
# Rename branch
git branch -m <old-name> <new-name>

# Delete branch locally
git branch -d <branch-name>

# Delete branch remotely
git push origin --delete <branch-name>

# Recover deleted branch
git reflog
git checkout -b <branch-name> <commit-hash>
```

### Rollback Needed

```bash
# See what would be reverted
git revert --no-commit <commit-hash>

# Review changes
git status

# Abort if needed
git merge --abort

# Or commit the revert
git commit -m "Revert: [reason]"
```

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow Cheat Sheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Semantic Versioning](https://semver.org/)

---

## 📞 Questions?

Refer to:

- `BASELINE_METRICS.md` - Performance measurements
- `PERFORMANCE_ISSUES.md` - Detailed optimization roadmap
- `TESTING_INFRASTRUCTURE.md` - Testing guidelines
- Individual rollback plans in `docs/rollback/`

---

**Last Updated**: December 10, 2025  
**Version**: 1.0  
**Status**: Ready for Optimization Phases
