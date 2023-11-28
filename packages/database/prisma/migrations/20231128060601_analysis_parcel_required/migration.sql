/*
  Warnings:

  - Made the column `parcelId` on table `Analysis` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_parcelId_fkey";

-- AlterTable
ALTER TABLE "Analysis" ALTER COLUMN "parcelId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
