-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activityLevel" TEXT,
ADD COLUMN     "averageSleep" DOUBLE PRECISION,
ADD COLUMN     "caffeineIntake" TEXT,
ADD COLUMN     "currentSupplements" TEXT[],
ADD COLUMN     "dietType" TEXT,
ADD COLUMN     "medicalConditions" TEXT[];
