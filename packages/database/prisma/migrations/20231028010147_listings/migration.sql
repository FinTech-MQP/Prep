-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "parcelID" TEXT NOT NULL,
    "images" TEXT[],

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
