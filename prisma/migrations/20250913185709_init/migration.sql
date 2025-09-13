/*
  Warnings:

  - Added the required column `filename` to the `uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalname` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."uploads" ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "originalname" TEXT NOT NULL;
