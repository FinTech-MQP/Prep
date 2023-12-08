-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "townsWithin300ft" TEXT[] DEFAULT ARRAY[]::TEXT[];
