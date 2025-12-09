/*
  Warnings:

  - The primary key for the `_CourseDisciplines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_CourseTeachers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_DisciplineTeachers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_RolePermissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_UserRoles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_CourseDisciplines` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_CourseTeachers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_DisciplineTeachers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_RolePermissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_UserRoles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_CourseDisciplines" DROP CONSTRAINT "_CourseDisciplines_AB_pkey";

-- AlterTable
ALTER TABLE "_CourseTeachers" DROP CONSTRAINT "_CourseTeachers_AB_pkey";

-- AlterTable
ALTER TABLE "_DisciplineTeachers" DROP CONSTRAINT "_DisciplineTeachers_AB_pkey";

-- AlterTable
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_AB_pkey";

-- AlterTable
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_AB_pkey";

-- CreateTable
CREATE TABLE "Director" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseDirectors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Director_email_key" ON "Director"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseDirectors_AB_unique" ON "_CourseDirectors"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseDirectors_B_index" ON "_CourseDirectors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseDisciplines_AB_unique" ON "_CourseDisciplines"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseTeachers_AB_unique" ON "_CourseTeachers"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_DisciplineTeachers_AB_unique" ON "_DisciplineTeachers"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_RolePermissions_AB_unique" ON "_RolePermissions"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserRoles_AB_unique" ON "_UserRoles"("A", "B");

-- AddForeignKey
ALTER TABLE "_CourseDirectors" ADD CONSTRAINT "_CourseDirectors_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseDirectors" ADD CONSTRAINT "_CourseDirectors_B_fkey" FOREIGN KEY ("B") REFERENCES "Director"("id") ON DELETE CASCADE ON UPDATE CASCADE;
