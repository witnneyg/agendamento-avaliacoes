/*
  Warnings:

  - Made the column `name` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseName` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `disciplineName` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `semesterName` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Scheduling" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "courseName" SET NOT NULL,
ALTER COLUMN "disciplineName" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL,
ALTER COLUMN "semesterName" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL;
