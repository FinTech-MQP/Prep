import { Prisma, PrismaClient } from "../generated/prisma-client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export type ListingPayload = Prisma.ListingGetPayload<{
  include: {
    address: {
      include: {
        parcel: {
          include: {
            zone: true;
            assessments: true;
            landUse: true;
            femaFloodZone: true;
          };
        };
      };
    };
    analyses: true;
  };
}>;
