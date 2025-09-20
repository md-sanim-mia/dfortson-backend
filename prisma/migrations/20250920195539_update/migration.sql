/*
  Warnings:

  - Added the required column `filename` to the `DocumentPdf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `DocumentPdf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalname` to the `DocumentPdf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `DocumentPdf` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DocumentPdf" ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "originalname" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
