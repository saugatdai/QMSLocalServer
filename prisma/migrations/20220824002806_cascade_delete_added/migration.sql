-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TokenProcessing" (
    "processingId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "operatorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "timeStamp" TEXT NOT NULL,
    CONSTRAINT "TokenProcessing_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "UserData" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TokenProcessing" ("operatorId", "processingId", "status", "timeStamp") SELECT "operatorId", "processingId", "status", "timeStamp" FROM "TokenProcessing";
DROP TABLE "TokenProcessing";
ALTER TABLE "new_TokenProcessing" RENAME TO "TokenProcessing";
CREATE TABLE "new_Customer" (
    "customerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "remarks" TEXT,
    "customerName" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    CONSTRAINT "Customer_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Customer" ("customerId", "customerName", "remarks", "tokenId") SELECT "customerId", "customerName", "remarks", "tokenId" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_tokenId_key" ON "Customer"("tokenId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
