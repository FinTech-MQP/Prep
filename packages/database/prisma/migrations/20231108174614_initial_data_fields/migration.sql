/*
  Warnings:

  - You are about to drop the column `address` on the `Listing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Assessment" (
    "parcelId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "improvements" INTEGER NOT NULL,
    "land" INTEGER NOT NULL,
    "total" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "LandUse" (
    "id" TEXT NOT NULL,
    "landUseDesc" TEXT NOT NULL,

    CONSTRAINT "LandUse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "zoneDesc" TEXT NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" TEXT NOT NULL,
    "sqft" INTEGER NOT NULL,
    "zoneId" TEXT NOT NULL,
    "landUseId" TEXT NOT NULL,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "num" INTEGER,
    "street" TEXT,
    "st_suffix" TEXT,
    "city" TEXT,
    "zip" TEXT,
    "parcelId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_parcelId_year_key" ON "Assessment"("parcelId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_addressId_key" ON "Listing"("addressId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_landUseId_fkey" FOREIGN KEY ("landUseId") REFERENCES "LandUse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
