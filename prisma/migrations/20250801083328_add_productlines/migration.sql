/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `productId` on the `StockMovement` table. All the data in the column will be lost.
  - Added the required column `productLineId` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "UserProduct_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quality" INTEGER NOT NULL DEFAULT 3,
    "description" TEXT NOT NULL DEFAULT '',
    "unitPrice" REAL NOT NULL DEFAULT 0,
    "initialStock" REAL NOT NULL DEFAULT 0,
    "currentStock" REAL NOT NULL DEFAULT 0,
    "minStock" REAL NOT NULL DEFAULT 0,
    "unite" TEXT NOT NULL DEFAULT 'Kg',
    "userProductId" TEXT NOT NULL,
    CONSTRAINT "ProductLine_userProductId_fkey" FOREIGN KEY ("userProductId") REFERENCES "UserProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StockMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productLineId" TEXT NOT NULL,
    "movementType" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "previousStock" REAL NOT NULL,
    "newStock" REAL NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "userProductId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockMovement_productLineId_fkey" FOREIGN KEY ("productLineId") REFERENCES "ProductLine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_userProductId_fkey" FOREIGN KEY ("userProductId") REFERENCES "UserProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StockMovement" ("createdAt", "id", "movementType", "newStock", "previousStock", "quantity", "reason", "userId") SELECT "createdAt", "id", "movementType", "newStock", "previousStock", "quantity", "reason", "userId" FROM "StockMovement";
DROP TABLE "StockMovement";
ALTER TABLE "new_StockMovement" RENAME TO "StockMovement";
CREATE INDEX "StockMovement_productLineId_idx" ON "StockMovement"("productLineId");
CREATE INDEX "StockMovement_userId_idx" ON "StockMovement"("userId");
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
