-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tokenBaseObject" (
    "tokenBaseId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tokenId" INTEGER NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "tokenProcessingInfoId" INTEGER,
    CONSTRAINT "tokenBaseObject_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tokenBaseObject" ("currentStatus", "tokenBaseId", "tokenId", "tokenProcessingInfoId") SELECT "currentStatus", "tokenBaseId", "tokenId", "tokenProcessingInfoId" FROM "tokenBaseObject";
DROP TABLE "tokenBaseObject";
ALTER TABLE "new_tokenBaseObject" RENAME TO "tokenBaseObject";
CREATE UNIQUE INDEX "tokenBaseObject_tokenId_key" ON "tokenBaseObject"("tokenId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
