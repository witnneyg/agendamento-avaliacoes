/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Director` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Director" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Director_userId_key" ON "Director"("userId");

-- CreateIndex
CREATE INDEX "Director_userId_idx" ON "Director"("userId");
