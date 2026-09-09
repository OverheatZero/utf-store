-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'client');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'client';
