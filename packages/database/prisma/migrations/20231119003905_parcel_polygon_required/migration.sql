/*
  Warnings:

  - Made the column `polygon` on table `Parcel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Parcel" ALTER COLUMN "polygon" SET NOT NULL;
