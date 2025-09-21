/*
  Warnings:

  - You are about to drop the column `analysis` on the `AIFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `overallScore` on the `AIFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `persuasivenessScore` on the `AIFeedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AIFeedback" DROP COLUMN "analysis",
DROP COLUMN "overallScore",
DROP COLUMN "persuasivenessScore",
ALTER COLUMN "suggestions" SET DATA TYPE TEXT;
