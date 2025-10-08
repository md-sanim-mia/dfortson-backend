/*
  Warnings:

  - You are about to drop the `AIFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentPdf` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HumanFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scenario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reference_audio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AIFeedback" DROP CONSTRAINT "AIFeedback_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HumanFeedback" DROP CONSTRAINT "HumanFeedback_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reference_audio" DROP CONSTRAINT "reference_audio_audioScenarioId_fkey";

-- DropTable
DROP TABLE "public"."AIFeedback";

-- DropTable
DROP TABLE "public"."DocumentPdf";

-- DropTable
DROP TABLE "public"."HumanFeedback";

-- DropTable
DROP TABLE "public"."Scenario";

-- DropTable
DROP TABLE "public"."Submission";

-- DropTable
DROP TABLE "public"."reference_audio";

-- DropEnum
DROP TYPE "public"."ScenarioStatus";
