/*
  Warnings:

  - You are about to drop the column `tokenCategory` on the `Token` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "tokenId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "tokenNumber" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Token_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "tokenCategoryCount" ("categoryId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Token" ("date", "tokenId", "tokenNumber") SELECT "date", "tokenId", "tokenNumber" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
