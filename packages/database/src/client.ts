import { Prisma, PrismaClient } from "../generated/prisma-client";

export const prisma = new PrismaClient().$extends({
  result: {
    parcel: {
      acres: {
        needs: { sqft: true },
        compute(parcel) {
          return parcel.sqft / 43560;
        },
      },
    },
  },
});

type ExtendedPrismaClient = typeof prisma

declare global {
  var prisma: ExtendedPrismaClient | undefined;
}

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
          };
        };
      };
    };
  };
}>;
