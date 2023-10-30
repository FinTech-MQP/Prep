import { prisma } from ".";

import type { Listing } from "../generated/prisma-client";

const DEFAULT_USERS = [
  // Add your own listings to pre-populate the database with
  {
    name: "Lakeside Retreat",
    desc: "A beautiful parcel overlooking a pristine lake.",
    address: "789 Lake Rd, Lakeville, LV 67890",
    parcelID: "PA789012",
    images: []
  },
] as Array<Partial<Listing>>;

(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((listing) =>
        prisma.listing.upsert({
          where: {
            id: listing.id!,
          },
          update: {
            ...listing,
          },
          create: {
            ...listing,
          },
        })
      )
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
