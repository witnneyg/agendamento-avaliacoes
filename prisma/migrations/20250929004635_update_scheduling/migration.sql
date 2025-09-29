/*
  Warnings:

  - You are about to drop the column `notes` on the `Scheduling` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Scheduling` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scheduling" DROP COLUMN "notes",
DROP COLUMN "phone";
