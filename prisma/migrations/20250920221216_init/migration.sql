/*
  Warnings:

  - You are about to drop the column `Speech` on the `Scenario` table. All the data in the column will be lost.
  - Added the required column `speech` to the `Scenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Scenario" DROP COLUMN "Speech",
ADD COLUMN     "speech" JSONB NOT NULL;
