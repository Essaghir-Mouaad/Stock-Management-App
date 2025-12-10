# Git Workflow Quick Reference

**For**: Stock Management App - Performance Optimization  
**Quick Link**: Full guide in `docs/DEVELOPMENT_WORKFLOW.md`

---

## 🚀 Quick Start

### Before Starting Work

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b optimize/db-query-indexing

# Push to set tracking
git push -u origin optimize/db-query-indexing
```

### While Working

```bash
# Make changes
# Edit files...

# Run pre-commit checks
npm run pre-commit-check

# Stage changes
git add .

# Commit with template
git commit

# (Editor opens with template - fill it out)

# Push to remote
git push
```

### Before Merging

```bash
# Run all checks
npm test
npm run lint
npm run pre-commit-check

# Rebase with main (if needed)
git fetch origin
git rebase origin/main

# Push final version
git push
```

---

## 📝 Branch Naming

### Format: `<type>/<area>-<description>`

**Types**: optimize, refactor, test, fix, docs  
**Areas**: db, query, api, frontend, auth, analytics

**Examples**:

```
optimize/db-query-indexing
refactor/analytics-aggregation
test/stock-movement-coverage
fix/n-plus-one-invoices
docs/optimization-roadmap
```

---

## 💬 Commit Messages

### Template Setup

```bash
git config commit.template .gitmessage
```

### Required Fields

- **Type**: optimize | refactor | test | fix | docs
- **Area**: db | query | api | frontend | etc
- **Performance**: Metrics (if optimization)
- **Tests Updated**: yes/no
- **Migration Required**: yes/no

### Example

```
optimize: db - Add index on user email

Added composite index (email, createdAt) to User model.
This improves getInvoiceProductByEmail from 150ms to 12ms.

Type: optimize
Area: db
Performance Impact: measured

Before: 150ms
After:  12ms
Improvement: 92% faster

Tests Updated: yes
```

---

## ✅ Pre-commit Checks

### Run Before Every Commit

```bash
npm run pre-commit-check
```

### What Gets Checked

1. ✅ All tests pass
2. ✅ No console.log in production
3. ✅ ESLint passes
4. ✅ TypeScript compiles
5. ✅ Git status clean
6. ⚠️ Performance baseline

---

## 🔄 Common Commands

### Create Branch

```bash
git checkout -b optimize/db-indexes
git push -u origin optimize/db-indexes
```

### Update Branch

```bash
git fetch origin
git rebase origin/main
```

### Merge Branch (via GitHub)

- Create Pull Request
- Fill description
- Reference issue
- Include metrics
- Get approval
- Merge & delete branch

### Or Manual Merge

```bash
git checkout main
git merge optimize/db-indexes
git branch -d optimize/db-indexes
```

### Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1

# Edit last commit
git commit --amend
```

### See Commit History

```bash
git log --oneline | head -10
git log --graph --oneline --all
```

---

## 🆘 Rollback

### Quick Rollback

```bash
# Find commit to revert
git log --oneline | head -10

# Revert it
git revert <commit-hash>

# Or revert multiple
git revert <old-hash>..<new-hash>

# Push reverted state
git push
```

### Database Rollback (if needed)

```bash
# Check migrations
npx prisma migrate status

# Resolve as rolled back
npx prisma migrate resolve --rolled-back <migration-name>

# Verify
npx prisma migrate status
```

---

## 📊 Performance Tracking

### Measure Before

```bash
npm test
npx ts-node tests/benchmarks.ts > BASELINE.md
```

### After Changes

```bash
npx ts-node tests/benchmarks.ts > OPTIMIZED.md
diff BASELINE.md OPTIMIZED.md
```

### Include in Commit

```
Before: 150ms
After:  12ms
Improvement: 92%
```

---

## 🎯 Phase Workflow

### Phase 1: Database Optimization

```bash
git checkout -b optimize/db-indexing
# Make changes
npm test
npm run pre-commit-check
git commit
git push
```

### Phase 2: Query Optimization

```bash
git checkout main
git pull
git checkout -b optimize/query-aggregation
# Make changes
...
```

### Phase 3: Frontend Optimization

```bash
git checkout main
git pull
git checkout -b refactor/component-memoization
# Make changes
...
```

### Phase 4: Hardening

```bash
git checkout main
git pull
git checkout -b refactor/validation-layer
# Make changes
...
```

---

## 🔗 Important Files

| File                           | Purpose              |
| ------------------------------ | -------------------- |
| `.gitmessage`                  | Commit template      |
| `scripts/pre-commit-check.ts`  | Pre-commit validator |
| `docs/DEVELOPMENT_WORKFLOW.md` | Full guide           |
| `docs/rollback/PHASE1_*.md`    | Rollback procedures  |

---

## ✨ Best Practices

✅ **DO**

- Run `npm run pre-commit-check` before committing
- Include performance metrics in optimization commits
- Write clear, descriptive messages
- Keep commits focused and small
- Push regularly to avoid loss
- Create comprehensive rollback plans

❌ **DON'T**

- Commit without running tests
- Skip the commit template
- Mix unrelated changes
- Use vague branch/commit names
- Force push to main
- Commit console.log statements

---

## 📞 Troubleshooting

**Tests fail?**

```bash
npm test -- --clearCache
```

**Merge conflicts?**

```bash
git status
git diff
# Edit files, then:
git add .
git commit
```

**Wrong branch?**

```bash
git branch -m <old-name> <new-name>
```

**Need to undo push?**

```bash
git revert <commit-hash>
git push
```

---

## 📚 Full Documentation

See `docs/DEVELOPMENT_WORKFLOW.md` for:

- Detailed branch strategies
- Complete commit examples
- Detailed rollback procedures
- Phase workflows
- Troubleshooting guide

---

**Quick Reference Version**: 1.0  
**Last Updated**: December 10, 2025  
**Status**: Ready for Optimization
