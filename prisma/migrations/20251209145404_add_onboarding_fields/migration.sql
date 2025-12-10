/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "appGoals" TEXT[],
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "fullname" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "healthGoals" TEXT[],
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "supplementExperience" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;
