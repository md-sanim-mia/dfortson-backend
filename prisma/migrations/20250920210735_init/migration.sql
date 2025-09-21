/*
  Warnings:

  - You are about to drop the column `clientPerspectiveDoc` on the `Scenario` table. All the data in the column will be lost.
  - You are about to drop the column `cohort` on the `Scenario` table. All the data in the column will be lost.
  - You are about to drop the column `scenarioDoc` on the `Scenario` table. All the data in the column will be lost.
  - Added the required column `Speech` to the `Scenario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `additionalDocument` to the `Scenario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markingPointer` to the `Scenario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scenario` to the `Scenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Scenario" DROP COLUMN "clientPerspectiveDoc",
DROP COLUMN "cohort",
DROP COLUMN "scenarioDoc",
ADD COLUMN     "Speech" JSONB NOT NULL,
ADD COLUMN     "additionalDocument" JSONB NOT NULL,
ADD COLUMN     "markingPointer" JSONB NOT NULL,
ADD COLUMN     "scenario" JSONB NOT NULL;
