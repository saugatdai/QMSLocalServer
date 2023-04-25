/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `tokenCategoryCount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tokenCategoryCount_category_key" ON "tokenCategoryCount"("category");
