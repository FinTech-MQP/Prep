-- DropForeignKey
ALTER TABLE "Parcel" DROP CONSTRAINT "Parcel_femaFloodZoneId_fkey";

-- AlterTable
ALTER TABLE "Parcel" ALTER COLUMN "femaFloodZoneId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_femaFloodZoneId_fkey" FOREIGN KEY ("femaFloodZoneId") REFERENCES "FloodZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
