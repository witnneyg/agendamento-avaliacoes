/*
  Warnings:

  - You are about to drop the column `classId` on the `Discipline` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Discipline" DROP CONSTRAINT "Discipline_classId_fkey";

-- AlterTable
ALTER TABLE "Discipline" DROP COLUMN "classId";
