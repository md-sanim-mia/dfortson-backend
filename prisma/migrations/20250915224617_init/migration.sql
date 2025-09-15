/*
  Warnings:

  - Added the required column `course` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('SUBMISSION', 'FEEDBACK', 'REMINDER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('SUBMITTED', 'EVALUATED');

-- CreateEnum
CREATE TYPE "public"."ScenarioStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'CLOSED');

-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "batch" TEXT,
ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "year" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Scenario" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scenarioDoc" TEXT NOT NULL,
    "clientPerspectiveDoc" TEXT NOT NULL,
    "cohort" TEXT,
    "releaseDate" TIMESTAMP(3),
    "status" "public"."ScenarioStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "audioFile" TEXT NOT NULL,
    "transcript" TEXT,
    "supportingDocs" JSONB,
    "score" DOUBLE PRECISION,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AIFeedback" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "persuasivenessScore" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "suggestions" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HumanFeedback" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "scoreAdjust" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HumanFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIFeedback_submissionId_key" ON "public"."AIFeedback"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "HumanFeedback_submissionId_key" ON "public"."HumanFeedback"("submissionId");

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "public"."Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIFeedback" ADD CONSTRAINT "AIFeedback_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HumanFeedback" ADD CONSTRAINT "HumanFeedback_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
