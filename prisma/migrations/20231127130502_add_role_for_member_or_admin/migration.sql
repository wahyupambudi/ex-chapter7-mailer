-- CreateEnum
CREATE TYPE "role" AS ENUM ('member', 'admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "role" NOT NULL DEFAULT 'member';
