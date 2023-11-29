/*
  Warnings:

  - You are about to drop the column `parcelId` on the `Analysis` table. All the data in the column will be lost.
  - Added the required column `listingId` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_parcelId_fkey";

-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "parcelId",
ADD COLUMN     "listingId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
