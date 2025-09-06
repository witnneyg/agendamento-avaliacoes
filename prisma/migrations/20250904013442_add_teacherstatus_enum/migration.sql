-- CreateEnum
CREATE TYPE "TeachersStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "status" "TeachersStatus" NOT NULL DEFAULT 'ACTIVE';
