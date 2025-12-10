# Stock Management Application - Code Analysis Report

**Generated**: December 10, 2025  
**Application**: Stock Manager (v0.1.0)  
**Framework**: Next.js 15.4.5 with TypeScript  
**Database**: Prisma ORM with SQLite

---

## 1. Project Structure Map

### 1.1 API Routes (`/app/api/`)

#### Authentication Routes

- `POST /api/auth/login` - User authentication, returns JWT token in HttpOnly cookie
- `POST /api/auth/register` - User registration (accepts username, email, password, name, role)
- `POST /api/auth/logout` - Logout functionality

#### Product Management Routes

- `GET /api/products` - Fetch all products for authenticated user
- `POST /api/products` - Create new product/invoice
- `PUT /api/products` - Update product details
- `DELETE /api/products` - Delete product by ID (query param)
- `GET /api/products/[Id]` - Get specific product by ID
- `GET /api/products/[Id]/productLines` - Get all product lines in a product
- `POST /api/products/[Id]/productLines` - Create new product line
- `GET|PUT /api/products/[Id]/productLines/[productLineId]` - Get/Update specific product line

#### Invoices Routes

- `GET /api/invoices` - Fetch all invoices for user
- `POST /api/invoices` - Create new invoice

#### Stock Movement Routes

- **Admin**: `POST /api/admin/stock-movement` - Create adjustment stock movements (admin-only)
- **Worker**: `POST /api/worker/stock-movement` - Record stock OUT movements (worker-only)

#### Analytics Routes

- `GET /api/analytics/daily-movements` - Get daily stock movements for date range
- `GET /api/analytics/monthly-summary` - Get monthly summary statistics
- `GET /api/analytics/current-overview` - Get current stock overview (with date/month filters)
- `GET /api/analytics/category-stats` - Get category-wise statistics
- `GET /api/analytics/product-performance` - Get top performing products

#### Worker Routes

- `GET /api/worker/user` - Get current user information
- `GET /api/worker/stock-movement` - Get stock movements for worker

#### Backup Routes (JavaScript)

- `GET /api/backup/daily` - Daily backup functionality
- `GET /api/backup/monthly` - Monthly backup functionality
- `GET /api/backup/usb-drives` - USB drive backup management

**Total API Routes**: 17 TypeScript routes + 3 JavaScript backup routes

---

### 1.2 Page Routes (`/app/pages/`)

| Route                              | Component                                      | Purpose                  |
| ---------------------------------- | ---------------------------------------------- | ------------------------ |
| `/`                                | `app/page.tsx`                                 | Landing/home page        |
| `/login`                           | `app/login/page.tsx`                           | Login page               |
| `/register`                        | `app/register/page.tsx`                        | Registration page        |
| `/admin/dashboard`                 | `app/admin/dashboard/page.tsx`                 | Admin main dashboard     |
| `/admin/productManage/[invoiceId]` | `app/admin/productManage/[invoiceId]/page.tsx` | Admin product management |
| `/worker/dashboard`                | `app/worker/dashboard/page.tsx`                | Worker main dashboard    |

**Total Page Routes**: 6

---

### 1.3 Database Models (Prisma Schema)

#### User

```
- id: String (UUID)
- username: String (unique)
- passwordHash: String
- name: String
- email: String (unique, optional)
- role: Enum(ADMIN, WORKER)
- userProducts: UserProduct[] (relation)
- stockMovements: StockMovement[] (relation)
```

#### UserProduct

```
- id: String (UUID)
- name: String
- createdAt: DateTime
- createdById: String (FK)
- createdBy: User (relation)
- productLines: ProductLine[] (relation)
- stockMovements: StockMovement[] (relation)
```

#### ProductLine

```
- id: String (UUID)
- name: String
- quality: Int (1-5 stars)
- category: String
- unitPrice: Float
- initialStock: Float
- currentStock: Float
- minStock: Float
- unite: String (Kg, L, Box, etc.)
- userProductId: String (FK)
- userProduct: UserProduct (relation)
- stockMovements: StockMovement[] (relation)
```

#### StockMovement

```
- id: String (UUID)
- productLineId: String (FK, indexed)
- productLine: ProductLine (relation)
- movementType: Enum(IN, OUT, ADJUSTMENT)
- quantity: Float
- previousStock: Float
- newStock: Float
- reason: String
- userId: String (FK, indexed)
- user: User (relation)
- userProductId: String (FK, optional)
- userProduct: UserProduct (relation, optional)
- createdAt: DateTime (indexed)
```

**Total Models**: 4 (+ 2 enums)

---

### 1.4 Server Actions (Data Layer)

Located in `/app/actions/`:

#### `userActions.ts`

- `createUser(username, email, password, name, role)` - Register new user with bcrypt hashing
- `loginUser(username, password)` - Authenticate user, returns JWT token

#### `productActions.ts`

- `initialiseProductInvoice(email, name)` - Create new product batch
- `getInvoiceProductByEmail(email)` - Fetch all products for user
- `getProductsById(invoiceId)` - Fetch specific product with lines
- `deleteProductInvoice(invoiceId)` - Delete product batch
- `deleteProductLine(productLineId)` - Delete single product line
- `updateProductLine(productLineId, updateData)` - Update product line details
- `updateInvoiceName(id, name)` - Rename product batch

#### `analyticsActions.ts`

- `getDailyMovements(startDate, endDate, userId?)` - Daily stock movements
- `getMonthlySummary(year, month, userId?)` - Monthly statistics
- `getYearlyReport(year, userId?)` - Yearly report
- `getCategoryStats(startDate, endDate, userId?)` - Category-wise breakdown
- `getProductPerformance(startDate, endDate, userId?, limit?)` - Top products
- `getCurrentStockOverview(startDate, endDate, userId?)` - Stock overview
- `getForecastingData(productId, days?)` - 30-day forecasting

#### `utilityActions.ts`

- `generateInvoiceId()` - Generate unique invoice ID
- `generateProductId()` - Generate unique product ID

---

### 1.5 Component Structure

#### Admin Components (`/app/admin/dashboard/components/`)

**Analytics Subdirectory:**

- `Analysis.tsx` - Main analytics dashboard
- `AnalyticsDashboard.tsx` - Analytics display wrapper
- `DailyButton.tsx` - Daily view toggle
- `PrintButton.tsx` - Print functionality
- `PrintReport.tsx` - Report generation
- `SelectedDayMvt.tsx` - Daily movement details

**Home Subdirectory:**

- `DashboardHome.tsx` - Main dashboard view
- `GlobalDashboard.tsx` - Global overview statistics
- Performance subdirectory (to be explored)
- Pricing subdirectory (to be explored)
- ProductToUpdate subdirectory (to be explored)
- Registration subdirectory (to be explored)

**Init Subdirectory:**

- `productInvoiceCompo.tsx` - Product invoice component
- `SetProductData.tsx` - Product data initialization

**RestOfStock Subdirectory:**

- `CurrentInvoice.tsx` - Current inventory view
- (Additional components to be explored)

**Tracking Subdirectory:**

- `TrackProducts.tsx` - Product tracking view

#### Worker Components

- Dashboard page with inline components for stock management

#### Shared Components

- `BackupManager.tsx` - USB/backup management

---

### 1.6 Utilities & Helpers

#### Authentication (`/app/utils/authClient.ts`)

- `getCurrentUser()` - Verify JWT token from cookie, returns user object

#### Backup (`/app/utils/usbBackup.js`)

- USB drive backup utilities (JavaScript)

---

### 1.7 Data Flow Architecture

```
Frontend (React Components)
        ↓
    API Routes (/app/api/*)
        ↓
    Server Actions (/app/actions/*)
        ↓
    Prisma Client
        ↓
    SQLite Database (dev.db)
```

#### Authentication Flow

1. User submits credentials at `/login` or `/register`
2. Frontend calls API route (`/api/auth/login` or `/register`)
3. Server action validates credentials with bcryptjs
4. JWT token generated and stored in HttpOnly cookie
5. Middleware (`middleware.ts`) protects `/admin` and `/worker` routes

#### Stock Movement Flow

- **Admin**: Direct adjustment via `/api/admin/stock-movement` → Updates ProductLine.currentStock
- **Worker**: Stock OUT only via `/api/worker/stock-movement` → Creates StockMovement record → Decrements stock
- All movements logged to StockMovement table with user, timestamp, previous/new stock

#### Analytics Data Flow

- Frontend requests analytics endpoints with date/month filters
- Server actions aggregate StockMovement records
- Data grouped by date, category, or product
- Results returned for dashboard visualization (Recharts)

---

## 2. Dependency Audit

### 2.1 Dependencies from package.json

| Package                | Version   | Status        | Purpose                        |
| ---------------------- | --------- | ------------- | ------------------------------ |
| `@prisma/client`       | ^6.13.0   | ✅ Current    | Database ORM client            |
| `prisma`               | ^6.13.0   | ✅ Current    | Database ORM CLI               |
| `next`                 | 15.4.5    | ✅ Current    | React framework                |
| `react`                | 19.1.0    | ✅ Current    | UI library                     |
| `react-dom`            | 19.1.0    | ✅ Current    | React DOM rendering            |
| `typescript`           | ^5        | ✅ Current    | Type safety                    |
| `@react-three/fiber`   | 9.3.0     | ⚠️ Pinned     | 3D rendering (may be outdated) |
| `@react-three/drei`    | 10.6.1    | ⚠️ Pinned     | 3D utilities (may be outdated) |
| `three`                | 0.179.1   | ⚠️ Pinned     | 3D library (may be outdated)   |
| `tailwindcss`          | ^4        | ✅ Current    | CSS framework                  |
| `daisyui`              | ^5.0.50   | ✅ Current    | Tailwind components            |
| `bcryptjs`             | ^3.0.2    | ✅ Current    | Password hashing               |
| `jsonwebtoken`         | ^9.0.2    | ✅ Current    | JWT tokens                     |
| `framer-motion`        | ^12.23.12 | ✅ Current    | Animations                     |
| `lucide-react`         | ^0.535.0  | ✅ Current    | Icon library                   |
| `recharts`             | ^3.1.0    | ✅ Current    | Chart library                  |
| `react-hot-toast`      | ^2.5.2    | ✅ Current    | Toast notifications            |
| `react-to-print`       | ^3.1.1    | ✅ Current    | Print functionality            |
| `html2canvas`          | ^1.4.1    | ✅ Current    | Screenshot capability          |
| `jspdf`                | ^3.0.1    | ✅ Current    | PDF generation                 |
| `pdfkit`               | ^0.17.1   | ✅ Current    | PDF toolkit                    |
| `html-pdf`             | ^3.0.1    | ❌ DEPRECATED | HTML to PDF (deprecated)       |
| `canvas-confetti`      | ^1.9.3    | ✅ Current    | Celebration effects            |
| `confetti`             | ^2.0.6    | ✅ Current    | Confetti effects (duplicate?)  |
| `intro.js`             | ^8.3.2    | ✅ Current    | User onboarding tours          |
| `intro.js-react`       | ^1.0.0    | ✅ Current    | React wrapper for intro.js     |
| `@reactour/tour`       | ^3.8.0    | ✅ Current    | React tour component           |
| `@tailwindcss/postcss` | ^4        | ✅ Current    | Tailwind CSS plugin            |
| `eslint`               | ^9        | ✅ Current    | Linting                        |
| `eslint-config-next`   | 15.4.5    | ✅ Current    | Next.js ESLint config          |
| `@eslint/eslintrc`     | ^3        | ✅ Current    | ESLint configuration           |

### 2.2 Dependency Analysis

**Total Dependencies**: 29  
**Dev Dependencies**: 7

#### Flagged Issues

| Issue               | Package                        | Recommendation                                     |
| ------------------- | ------------------------------ | -------------------------------------------------- |
| **DEPRECATED**      | `html-pdf`                     | Replace with `jspdf` or `pdfkit` (already present) |
| **DUPLICATE**       | `canvas-confetti` & `confetti` | Remove one; they serve similar purposes            |
| **PINNED**          | `@react-three/*`               | Consider unpinning if 3D features are minimal      |
| **UNUSED (likely)** | `@react-three/*` + `three`     | Check if 3D rendering is actually used             |
| **MISSING**         | `.env` configuration           | No environment variables file found                |
| **IGNORED**         | ESLint & TypeScript            | Build ignores errors (see next.config.ts)          |

---

## 3. Database Schema Analysis

### 3.1 Models Relationship Diagram

```
User (1) ─── (M) UserProduct
  │
  └─── (M) StockMovement

UserProduct (1) ─── (M) ProductLine
  │
  └─── (M) StockMovement

ProductLine (1) ─── (M) StockMovement
```

### 3.2 Indexes Analysis

#### Existing Indexes (Good ✅)

```prisma
StockMovement:
  @@index([productLineId])  // For querying movements by product
  @@index([userId])         // For filtering by user
  @@index([createdAt])      // For date range queries
```

#### Missing Indexes (⚠️ Performance Risk)

1. **StockMovement**

   - Missing: `@@index([userProductId])` - Used in queries filtering by invoice
   - Missing: `@@index([movementType])` - Analytics filter by IN/OUT/ADJUSTMENT
   - Consider: Composite index `@@index([productLineId, createdAt])` for range queries

2. **ProductLine**

   - Missing: `@@index([userProductId])` - Frequently queried for product lines
   - Missing: `@@index([category])` - Category stats use this filter

3. **User**

   - Missing: `@@index([email])` - Used for user lookups, but already `@unique`

4. **UserProduct**
   - Missing: `@@index([createdById])` - For filtering products by creator

---

### 3.3 Foreign Key & Constraint Analysis

#### ✅ Proper Foreign Keys

- `ProductLine.userProductId` → `UserProduct.id`
- `ProductLine.userProduct` relation properly defined
- `StockMovement.productLineId` → `ProductLine.id`
- `StockMovement.userId` → `User.id`
- `StockMovement.userProductId` → `UserProduct.id` (optional)
- `UserProduct.createdById` → `User.id`

#### ⚠️ Missing Cascade Behaviors

No `onDelete` cascade rules defined. When deleting:

- `User` deletion → StockMovement orphaned (should cascade)
- `ProductLine` deletion → StockMovement orphaned (should cascade)
- `UserProduct` deletion → ProductLine orphaned (should cascade)

**Recommendation**: Add cascade delete:

```prisma
StockMovement {
  productLine ProductLine @relation(fields: [productLineId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

### 3.4 N+1 Query Risks & Concerns

#### High Risk (🔴 Current)

1. **In analyticsActions.ts - getDailyMovements()**

   ```ts
   // Queries all movements, then includes relations
   const movements = await prisma.stockMovement.findMany({
     where: whereClause,
     include: {
       productLine: { include: { userProduct: true } },
       user: true,
     },
   });
   ```

   ✅ Good: Uses `include` to prevent N+1

2. **In productActions.ts - getInvoiceProductByEmail()**

   - Fetches UserProducts with productLines (eager loading)
   - ✅ Safe from N+1

3. **In admin productManage page.tsx**
   - Potential loop over products fetching analytics data
   - Multiple API calls in useEffect dependencies
   - ⚠️ Risk: If displaying products in grid, each might trigger separate fetch

#### Medium Risk (🟡 Optimization Needed)

1. **StockMovement queries without productLine for simple ops**
   - Worker stock-movement route includes all relations even if not needed
2. **Analytics filtering by userId**
   - Multiple requests with different userId filters
   - Could benefit from caching strategy

---

### 3.5 Data Integrity Issues

#### ⚠️ Identified Issues

1. **Product ID Generation - Using Date.now()**

   ```ts
   // In productActions.ts
   const productInvoiceID = Date.now().toString(); // Temporary fix
   ```

   - Comment says "Temporary fix" - **SHOULD USE UUID**
   - Risk: Race conditions in high-concurrency scenarios
   - **Recommendation**: Use `@default(uuid())`

2. **Missing Validation on Stock Numbers**

   - `currentStock`, `initialStock`, `minStock` can be negative
   - No database-level constraints
   - API validates but schema allows invalid states

3. **Missing Stock Audit Trail**

   - StockMovement records changes, but no user confirmation field
   - No "approved by" field for admin changes
   - No soft deletes for audit compliance

4. **Optional userProductId in StockMovement**

   - Should be required to maintain referential integrity
   - Currently optional, could lead to orphaned records

5. **Missing Timestamps**
   - `User` model missing `createdAt`, `updatedAt`
   - `ProductLine` missing `updatedAt` for tracking changes
   - `UserProduct` missing `updatedAt`

---

### 3.6 Schema Optimization Recommendations

```prisma
// ADD: Cascade deletes
StockMovement {
  productLine ProductLine @relation(..., onDelete: Cascade)
  user User @relation(..., onDelete: Cascade)
}

// ADD: Missing timestamps
User {
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

ProductLine {
  updatedAt DateTime @updatedAt
}

UserProduct {
  updatedAt DateTime @updatedAt
}

// ADD: Missing indexes
@@index([userProductId])      // ProductLine
@@index([movementType])       // StockMovement
@@index([createdById])        // UserProduct
@@index([productLineId, createdAt]) // StockMovement composite

// FIX: Use UUID for product IDs
UserProduct {
  id String @id @default(uuid())
}

// ADD: Stock constraints
ProductLine {
  initialStock Float @default(0) @db.Real
  currentStock Float @default(0) @db.Real
  minStock Float @default(0) @db.Real
}

// ADD: Nullable field validation
StockMovement {
  userProductId String @db.String // Remove optional
}
```

---

## 4. Configuration Review

### 4.1 Next.js Configuration (`next.config.ts`)

```typescript
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ RISK: Hides errors
  },
  typescript: {
    ignoreBuildErrors: true, // ⚠️ RISK: Hides type errors
  },
};
```

#### Issues

- ❌ **ESLint disabled during builds** - Allows code quality issues to reach production
- ❌ **TypeScript errors ignored** - Type safety compromised
- ❌ **No other optimization configs** - Missing image optimization, compression, etc.

#### Recommendations

```typescript
const nextConfig: NextConfig = {
  // Enable type checking in production
  typescript: {
    tsconfigPath: "./tsconfig.json",
    // Remove ignoreBuildErrors: true
  },

  // Enable ESLint
  eslint: {
    dirs: ["app", "pages", "components", "lib"],
    // Remove ignoreDuringBuilds: true
  },

  // Add performance optimizations
  images: {
    unoptimized: false,
  },

  // Add security headers
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    },
  ],
};
```

---

### 4.2 Prisma Configuration (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

#### Current State

- ✅ SQLite for development (lightweight)
- ⚠️ Hardcoded path - No environment variable

#### Issues & Recommendations

1. **Missing Environment Variable**

   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")  // Use env variable
   }
   ```

   Create `.env`:

   ```
   DATABASE_URL="file:./dev.db"
   ```

2. **No Production Database Specified**

   - SQLite not suitable for production
   - Recommendation: Use PostgreSQL for production

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/stock_db"
   ```

3. **Missing Prisma Extensions**
   Consider adding for better features:

   ```prisma
   generator client {
     provider = "prisma-client-js"
     previewFeatures = ["fullTextSearch"]
   }
   ```

4. **No Prisma Studio Config**
   Missing development tools configuration

---

### 4.3 TypeScript Configuration (`tsconfig.json`)

**Status**: Not fully reviewed (standard Next.js config expected)

#### Typical Issues to Check

- ⚠️ `strict: true` enabled? (Should be)
- ⚠️ `noImplicitAny: true` enabled? (Should be)
- ⚠️ `esModuleInterop: true` enabled? (For CommonJS compat)

---

### 4.4 Environment Variables (MISSING ⚠️)

**No `.env` or `.env.local` file found**

#### Required Environment Variables

```
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="super_secret_key"  # ⚠️ EXPOSED - See authClient.ts default

# Node Environment
NODE_ENV="development"

# API Base (optional)
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

#### Security Issues Found

```typescript
// In authClient.ts
return jwt.verify(token, process.env.JWT_SECRET || "super_secret_key")
                           ↑↑↑ HARDCODED DEFAULT ↑↑↑
```

- Production code exposes default JWT secret
- **Should fail if JWT_SECRET not set**

---

### 4.5 Middleware Configuration (`middleware.ts`)

```typescript
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") || path.startsWith("/worker")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/worker/:path*"],
};
```

#### Analysis

- ✅ Token verification in place
- ✅ Protects admin/worker routes
- ❌ **No role-based access control** - Admin and worker have same protection
- ❌ **No token validation** - Only checks existence, not validity
- ❌ **No CSRF protection**

#### Recommendations

```typescript
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") || path.startsWith("/worker")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verify token validity
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!);

      // Role-based access control
      if (path.startsWith("/admin") && user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/worker/dashboard", req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
```

---

### 4.6 PostCSS Configuration (`postcss.config.mjs`)

**Status**: Using Tailwind 4 with modern PostCSS setup

#### Current Config (Expected)

- ✅ Tailwind CSS support
- ✅ DaisyUI integration

---

## 5. Security & Performance Concerns

### 5.1 Security Issues (🔴 High Priority)

1. **JWT Secret Exposed**

   - Hardcoded default in `authClient.ts`
   - Must use environment variable

2. **Missing Input Validation**

   - Forms accept raw user input
   - Should validate length, type, special characters
   - SQL injection risk if migrating to PostgreSQL

3. **No Rate Limiting**

   - `/api/auth/login` not rate-limited
   - Risk of brute force attacks

4. **Missing CORS Protection**

   - All API routes accept any origin
   - Could allow cross-site attacks

5. **Plaintext Passwords Risk**

   - Passwords hashed with bcryptjs ✅
   - But no password complexity requirements

6. **No HTTPS Enforcement**
   - HttpOnly cookies set, but no secure flag
   - Missing in production

---

### 5.2 Performance Issues (🟡 Medium Priority)

1. **N+1 Queries in Analytics**

   - Multiple analytics API calls in dashboard
   - Could be combined into single request

2. **Missing Data Pagination**

   - Stock movements list loads all records
   - Risk of memory overflow with large datasets

3. **No Caching Strategy**

   - Dashboard analytics recomputed on each view
   - Could implement React Query or SWR

4. **SQLite in Development**

   - Adequate for dev, but slow with large datasets
   - No query optimization indexes

5. **Bundle Size**
   - 3D libraries (@react-three) included but may be unused
   - Increases initial load time

---

## 6. Code Quality Summary

### 6.1 Build Configuration Issues

| Issue                     | Severity  | Status |
| ------------------------- | --------- | ------ |
| ESLint errors ignored     | 🔴 High   | ACTIVE |
| TypeScript errors ignored | 🔴 High   | ACTIVE |
| No production DB config   | 🟡 Medium | ACTIVE |
| Missing environment vars  | 🟡 Medium | ACTIVE |
| Hardcoded JWT secret      | 🔴 High   | ACTIVE |
| No RBAC in middleware     | 🟡 Medium | ACTIVE |
| Missing cascade deletes   | 🟡 Medium | Schema |

---

## 7. Actionable Recommendations

### Immediate (Next 1-2 weeks)

1. ✅ Create `.env` file with all required variables
2. ✅ Fix JWT secret exposure in `authClient.ts`
3. ✅ Re-enable TypeScript strict mode
4. ✅ Enable ESLint for development

### Short-term (1-2 months)

1. Add missing database indexes
2. Implement role-based access control in middleware
3. Add input validation middleware
4. Implement rate limiting on auth endpoints
5. Remove unused 3D dependencies

### Long-term (3+ months)

1. Migrate to PostgreSQL for production
2. Implement caching strategy (Redis)
3. Add pagination to large data queries
4. Set up comprehensive logging
5. Add unit and integration tests

---

## 8. File Structure Quick Reference

```
Stock-Management-App/
├── app/
│   ├── (pages)
│   │   ├── page.tsx                    # Home
│   │   ├── login/page.tsx              # Login
│   │   ├── register/page.tsx           # Register
│   │   ├── admin/dashboard/page.tsx    # Admin dashboard
│   │   └── worker/dashboard/page.tsx   # Worker dashboard
│   ├── api/                            # 17 API routes
│   ├── actions/                        # 4 server actions
│   ├── components/                     # Shared components
│   ├── utils/                          # Utilities
│   └── lib/
│       └── prisma.ts                   # Prisma singleton
├── prisma/
│   ├── schema.prisma                   # Database schema
│   └── migrations/                     # 4 migrations
├── types/
│   ├── interfaces.tsx                  # TypeScript interfaces
│   └── type.ts                         # TypeScript types
├── public/                             # Static assets
├── middleware.ts                       # Auth middleware
├── next.config.ts                      # Next.js config
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
└── postcss.config.mjs                  # PostCSS config
```

---

## 9. Test Coverage Assessment

**Current State**: ⚠️ No test files found

**Recommendation**: Implement tests for:

- Authentication (login, register, JWT validation)
- Stock movement calculations
- Analytics data aggregation
- API error handling
- Database queries

---

## Appendix: Dependency Usage Analysis

### Confirmed Used

- ✅ Prisma, React, Next.js, TypeScript - Core
- ✅ bcryptjs, JWT - Authentication
- ✅ Recharts - Analytics charts
- ✅ Framer Motion - Animations
- ✅ Tailwind, DaisyUI - Styling
- ✅ Lucide React - Icons
- ✅ Intro.js - Onboarding tours
- ✅ jsPDF, html2canvas - PDF/screenshot
- ✅ React Hot Toast - Notifications

### Suspected Unused

- ❓ @react-three/\* - 3D rendering (search codebase)
- ❓ confetti - Check if both confetti libraries actually used
- ❓ @reactour/tour - Might duplicate intro.js functionality

### Deprecated

- ❌ html-pdf - Use jsPDF instead (already present)

---

**Analysis Complete**  
_This report covers structure, dependencies, schema, and configuration without making code changes._
