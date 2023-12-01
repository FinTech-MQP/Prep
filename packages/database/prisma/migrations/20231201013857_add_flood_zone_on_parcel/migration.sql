/*
  Warnings:

  - Added the required column `femaFloodZoneId` to the `Parcel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "femaFloodZoneId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FloodZone" (
    "id" INTEGER NOT NULL,
    "zoneName" TEXT NOT NULL,
    "floodway" TEXT NOT NULL,
    "specialFloodHazardArea" BOOLEAN NOT NULL,
    "polygon" "public".geometry NOT NULL,

    CONSTRAINT "FloodZone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_femaFloodZoneId_fkey" FOREIGN KEY ("femaFloodZoneId") REFERENCES "FloodZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
