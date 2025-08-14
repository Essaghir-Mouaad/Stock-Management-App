/*
  Warnings:

  - Added the required column `category` to the `ProductLine` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quality" INTEGER NOT NULL DEFAULT 3,
    "category" TEXT NOT NULL,
    "unitPrice" REAL NOT NULL DEFAULT 0,
    "initialStock" REAL NOT NULL DEFAULT 0,
    "currentStock" REAL NOT NULL DEFAULT 0,
    "minStock" REAL NOT NULL DEFAULT 0,
    "unite" TEXT NOT NULL DEFAULT 'Kg',
    "userProductId" TEXT NOT NULL,
    CONSTRAINT "ProductLine_userProductId_fkey" FOREIGN KEY ("userProductId") REFERENCES "UserProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductLine" ("currentStock", "id", "initialStock", "minStock", "name", "quality", "unitPrice", "unite", "userProductId") SELECT "currentStock", "id", "initialStock", "minStock", "name", "quality", "unitPrice", "unite", "userProductId" FROM "ProductLine";
DROP TABLE "ProductLine";
ALTER TABLE "new_ProductLine" RENAME TO "ProductLine";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
