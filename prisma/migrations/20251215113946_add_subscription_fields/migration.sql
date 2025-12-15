-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscriptionExpiry" TIMESTAMP(3),
ADD COLUMN     "subscriptionPlan" TEXT NOT NULL DEFAULT 'FREE',
ADD COLUMN     "subscriptionStatus" TEXT NOT NULL DEFAULT 'ACTIVE';
