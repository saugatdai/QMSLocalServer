/*
  Warnings:

  - Added the required column `tokenBaseId` to the `TokenProcessing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "tokenBaseObject" (
    "tokenBaseId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tokenId" INTEGER NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "tokenProcessingInfoId" INTEGER NOT NULL,
    CONSTRAINT "tokenBaseObject_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TokenProcessing" (
    "processingId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "operatorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "timeStamp" TEXT NOT NULL,
    "tokenBaseId" INTEGER NOT NULL,
    CONSTRAINT "TokenProcessing_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "UserData" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TokenProcessing_tokenBaseId_fkey" FOREIGN KEY ("tokenBaseId") REFERENCES "tokenBaseObject" ("tokenBaseId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TokenProcessing" ("operatorId", "processingId", "status", "timeStamp") SELECT "operatorId", "processingId", "status", "timeStamp" FROM "TokenProcessing";
DROP TABLE "TokenProcessing";
ALTER TABLE "new_TokenProcessing" RENAME TO "TokenProcessing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "tokenBaseObject_tokenId_key" ON "tokenBaseObject"("tokenId");
