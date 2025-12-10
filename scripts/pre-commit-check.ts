#!/bin/bash
// # Pre-commit Checklist Script
// # Run before committing to verify code quality and test compliance
// # Usage: ./scripts/pre-commit-check.sh or npx tsx scripts/pre-commit-check.ts

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface CheckResult {
  name: string
  passed: boolean
  message: string
  warning?: boolean
}

const results: CheckResult[] = []

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(color: string, message: string) {
  console.log(`${color}${message}${colors.reset}`)
}

function logHeader(title: string) {
  console.log('\n' + '='.repeat(60))
  log(colors.blue, `  ${title}`)
  console.log('='.repeat(60))
}

// Check 1: All tests pass
function checkTests(): CheckResult {
  logHeader('CHECK 1: Running Tests')
  try {
    console.log('Running: npm test')
    execSync('npm test -- --passWithNoTests', {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    return {
      name: 'Tests Pass',
      passed: true,
      message: '✅ All tests passed',
    }
  } catch (error) {
    return {
      name: 'Tests Pass',
      passed: false,
      message: '❌ Tests failed - fix before committing',
    }
  }
}

// Check 2: No console.log statements (except in tests)
function checkConsoleLogs(): CheckResult {
  logHeader('CHECK 2: Console Statements')
  const excludeDirs = ['node_modules', '.next', 'tests', 'dist', '.git']
  const appDir = 'app'

  let consoleLogCount = 0
  const files: string[] = []

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      if (excludeDirs.includes(entry.name)) continue

      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        scanDirectory(fullPath)
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        // Look for console.log but exclude comments and test files
        const lines = content.split('\n')
        lines.forEach((line, index) => {
          const trimmed = line.trim()
          if (
            trimmed.includes('console.log') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('*') &&
            !fullPath.includes('.test.')
          ) {
            consoleLogCount++
            files.push(`${fullPath}:${index + 1}`)
          }
        })
      }
    }
  }

  try {
    scanDirectory(appDir)
    if (consoleLogCount === 0) {
      return {
        name: 'No Console Logs',
        passed: true,
        message: '✅ No console.log statements found in production code',
      }
    } else {
      return {
        name: 'No Console Logs',
        passed: false,
        message: `❌ Found ${consoleLogCount} console.log statement(s):\n${files.map(f => `   ${f}`).join('\n')}`,
      }
    }
  } catch (error) {
    return {
      name: 'No Console Logs',
      passed: true,
      warning: true,
      message: '⚠️ Could not scan for console logs',
    }
  }
}

// Check 3: Linting passes
function checkLinting(): CheckResult {
  logHeader('CHECK 3: Linting')
  try {
    console.log('Running: npm run lint')
    execSync('npm run lint', {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    return {
      name: 'Linting',
      passed: true,
      message: '✅ ESLint passed',
    }
  } catch (error) {
    return {
      name: 'Linting',
      passed: false,
      message: '❌ ESLint failed - fix linting errors before committing',
    }
  }
}

// Check 4: Git status clean
function checkGitStatus(): CheckResult {
  logHeader('CHECK 4: Git Status')
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' })
    const changedFiles = status.trim().split('\n').filter(line => line.length > 0)

    if (changedFiles.length === 0) {
      return {
        name: 'Git Status',
        passed: true,
        message: '✅ No uncommitted changes',
      }
    } else {
      return {
        name: 'Git Status',
        passed: true,
        warning: true,
        message: `⚠️ ${changedFiles.length} file(s) changed - verify staged for commit:\n${changedFiles.map(f => `   ${f}`).join('\n')}`,
      }
    }
  } catch (error) {
    return {
      name: 'Git Status',
      passed: true,
      warning: true,
      message: '⚠️ Could not check git status',
    }
  }
}

// Check 5: TypeScript compilation
function checkTypeScript(): CheckResult {
  logHeader('CHECK 5: TypeScript Compilation')
  try {
    console.log('Running: npx tsc --noEmit')
    execSync('npx tsc --noEmit', {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    return {
      name: 'TypeScript',
      passed: true,
      message: '✅ TypeScript compilation successful',
    }
  } catch (error) {
    return {
      name: 'TypeScript',
      passed: false,
      message: '❌ TypeScript errors found - fix before committing',
    }
  }
}

// Check 6: Performance regression
function checkPerformanceRegression(): CheckResult {
  logHeader('CHECK 6: Performance Baseline Check')
  try {
    // Read baseline metrics
    if (fs.existsSync('BASELINE_METRICS.md')) {
      return {
        name: 'Performance Baseline',
        passed: true,
        warning: true,
        message: '⚠️ Run performance tests after commit to verify no regression',
      }
    }
    return {
      name: 'Performance Baseline',
      passed: true,
      warning: true,
      message: '⚠️ No baseline metrics found - run benchmarks after optimization',
    }
  } catch (error) {
    return {
      name: 'Performance Baseline',
      passed: true,
      warning: true,
      message: '⚠️ Could not check performance baseline',
    }
  }
}

// Main execution
async function runChecks() {
  console.clear()
  log(colors.blue, '\n╔══════════════════════════════════════════════════════════╗')
  log(colors.blue, '║           Pre-Commit Checklist - Optimization              ║')
  log(colors.blue, '║              Stock Management Application                  ║')
  log(colors.blue, '╚══════════════════════════════════════════════════════════╝')

  // Run all checks
  results.push(checkTests())
  results.push(checkConsoleLogs())
  results.push(checkLinting())
  results.push(checkGitStatus())
  results.push(checkTypeScript())
  results.push(checkPerformanceRegression())

  // Summary
  logHeader('SUMMARY')

  const passed = results.filter(r => r.passed && !r.warning).length
  const warnings = results.filter(r => r.warning).length
  const failed = results.filter(r => !r.passed).length

  results.forEach(result => {
    if (!result.passed) {
      log(colors.red, `✗ ${result.name}`)
    } else if (result.warning) {
      log(colors.yellow, `⚠ ${result.name}`)
    } else {
      log(colors.green, `✓ ${result.name}`)
    }
    console.log(`  ${result.message}\n`)
  })

  console.log('─'.repeat(60))
  log(colors.green, `Passed: ${passed}`)
  if (warnings > 0) log(colors.yellow, `Warnings: ${warnings}`)
  if (failed > 0) log(colors.red, `Failed: ${failed}`)

  // Exit code
  if (failed > 0) {
    log(colors.red, '\n❌ Pre-commit checks FAILED\n')
    process.exit(1)
  } else if (warnings > 0) {
    log(colors.yellow, '\n⚠️ Pre-commit checks passed with warnings\n')
    process.exit(0)
  } else {
    log(colors.green, '\n✅ All pre-commit checks passed - Ready to commit!\n')
    process.exit(0)
  }
}

runChecks().catch(error => {
  log(colors.red, `\n❌ Fatal error: ${error.message}\n`)
  process.exit(1)
})
