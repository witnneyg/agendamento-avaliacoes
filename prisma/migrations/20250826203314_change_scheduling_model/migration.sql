/*
  Warnings:

  - You are about to drop the column `courseName` on the `Scheduling` table. All the data in the column will be lost.
  - You are about to drop the column `disciplineName` on the `Scheduling` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Scheduling` table. All the data in the column will be lost.
  - You are about to drop the column `semesterName` on the `Scheduling` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `Scheduling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterId` to the `Scheduling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Scheduling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scheduling" DROP COLUMN "courseName",
DROP COLUMN "disciplineName",
DROP COLUMN "email",
DROP COLUMN "semesterName",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "semesterId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
