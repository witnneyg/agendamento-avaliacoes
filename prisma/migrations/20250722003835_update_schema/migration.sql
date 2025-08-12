/*
  Warnings:

  - You are about to drop the column `time` on the `Scheduling` table. All the data in the column will be lost.
  - Made the column `disciplineId` on table `Scheduling` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Scheduling" DROP CONSTRAINT "Scheduling_disciplineId_fkey";

-- AlterTable
ALTER TABLE "Scheduling" DROP COLUMN "time",
ADD COLUMN     "courseName" TEXT,
ADD COLUMN     "disciplineName" TEXT,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "semesterName" TEXT,
ADD COLUMN     "startTime" TIMESTAMP(3),
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "disciplineId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
