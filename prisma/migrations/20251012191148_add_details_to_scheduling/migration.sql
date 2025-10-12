/*
  Warnings:

  - Added the required column `details` to the `Scheduling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scheduling" ADD COLUMN     "details" JSONB NOT NULL;
