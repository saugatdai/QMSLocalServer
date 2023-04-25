-- CreateTable
CREATE TABLE "Token" (
    "tokenId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "tokenNumber" INTEGER NOT NULL,
    "tokenCategory" TEXT
);

-- CreateTable
CREATE TABLE "Customer" (
    "customerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "remarks" TEXT,
    "customerName" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    CONSTRAINT "Customer_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "counter" TEXT
);

-- CreateTable
CREATE TABLE "TokenProcessing" (
    "processingId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "operatorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "timeStamp" TEXT NOT NULL,
    CONSTRAINT "TokenProcessing_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "UserData" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tokenCategoryCount" (
    "categoryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT,
    "categoryName" TEXT NOT NULL,
    "currentTokenCount" INTEGER NOT NULL,
    "latestCustomerTokenCount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_tokenId_key" ON "Customer"("tokenId");
