/*
  Warnings:

  - You are about to drop the column `dayPeriod` on the `Discipline` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Discipline" DROP COLUMN "dayPeriod",
ADD COLUMN     "dayPeriods" "Period"[];
