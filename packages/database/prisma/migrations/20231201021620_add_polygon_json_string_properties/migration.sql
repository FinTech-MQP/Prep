/*
  Warnings:

  - Added the required column `polygonJSON` to the `FloodZone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `polygonJSON` to the `Parcel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FloodZone" ADD COLUMN     "polygonJSON" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "polygonJSON" TEXT NOT NULL;
