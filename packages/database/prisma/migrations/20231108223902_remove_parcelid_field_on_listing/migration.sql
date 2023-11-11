/*
  Warnings:

  - You are about to drop the column `parcelID` on the `Listing` table. All the data in the column will be lost.
  - Made the column `name` on table `Listing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `desc` on table `Listing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "parcelID",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "desc" SET NOT NULL;
