-- AlterTable
CREATE EXTENSION postgis;
ALTER TABLE "Parcel" ADD COLUMN     "polygon" "public".geometry;
