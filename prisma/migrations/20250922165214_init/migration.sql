/*
  Warnings:

  - You are about to drop the column `audioData` on the `reference_audio` table. All the data in the column will be lost.
  - Added the required column `audioUrl` to the `reference_audio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileFormate` to the `reference_audio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `reference_audio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."reference_audio" DROP COLUMN "audioData",
ADD COLUMN     "audioUrl" TEXT NOT NULL,
ADD COLUMN     "fileFormate" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
