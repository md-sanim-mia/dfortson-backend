-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "resetPasswordOTP" TEXT,
ADD COLUMN     "resetPasswordOTPExpiresAt" TIMESTAMP(3);
