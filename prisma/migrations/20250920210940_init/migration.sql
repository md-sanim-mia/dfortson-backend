/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Scenario` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Scenario` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Scenario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Scenario" DROP COLUMN "createdBy",
DROP COLUMN "releaseDate",
DROP COLUMN "status";
