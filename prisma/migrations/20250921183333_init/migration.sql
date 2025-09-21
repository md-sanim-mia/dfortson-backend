/*
  Warnings:

  - Changed the type of `audioFile` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Submission" DROP COLUMN "audioFile",
ADD COLUMN     "audioFile" JSONB NOT NULL;
