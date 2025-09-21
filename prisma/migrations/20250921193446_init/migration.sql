/*
  Warnings:

  - You are about to drop the column `scoreAdjust` on the `HumanFeedback` table. All the data in the column will be lost.
  - Added the required column `analysis` to the `AIFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallScore` to the `AIFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `persuasivenessScore` to the `AIFeedback` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `suggestions` on the `AIFeedback` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."AIFeedback" ADD COLUMN     "analysis" JSONB NOT NULL,
ADD COLUMN     "overallScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "persuasivenessScore" DOUBLE PRECISION NOT NULL,
DROP COLUMN "suggestions",
ADD COLUMN     "suggestions" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "public"."HumanFeedback" DROP COLUMN "scoreAdjust";
