-- CreateEnum
CREATE TYPE "TodaysFeeling" AS ENUM ('GREAT', 'GOOD', 'OKAY', 'LOW', 'ANGRY');

-- CreateEnum
CREATE TYPE "SideEffect" AS ENUM ('NAUSEA', 'ANXIETY', 'FATIGUE', 'HEADACHE', 'JITTERS', 'NO_SIDE_EFFECT');

-- CreateTable
CREATE TABLE "daily_check_ins" (
    "id" SERIAL NOT NULL,
    "todaysFeeling" "TodaysFeeling" NOT NULL,
    "didTakeAnythingNew" BOOLEAN NOT NULL,
    "anySideEffect" "SideEffect" NOT NULL,
    "sleepLastNight" INTEGER NOT NULL,
    "sleepQuality" INTEGER NOT NULL,
    "energyLevel" INTEGER NOT NULL,
    "focus" INTEGER NOT NULL,
    "wellnessImpact" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_check_ins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "daily_check_ins" ADD CONSTRAINT "daily_check_ins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
