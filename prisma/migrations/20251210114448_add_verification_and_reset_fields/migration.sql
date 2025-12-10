-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerificationOTP" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpExpiry" TIMESTAMP(3),
ADD COLUMN     "passwordResetExpiry" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
