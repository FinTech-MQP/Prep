// src/client.ts
import { PrismaClient } from "../generated/prisma-client";
var prisma = new PrismaClient().$extends({
  result: {
    parcel: {
      acres: {
        needs: { sqft: true },
        compute(parcel) {
          return parcel.sqft / 43560;
        }
      }
    }
  }
});
if (process.env.NODE_ENV !== "production")
  global.prisma = prisma;
export {
  prisma
};
//# sourceMappingURL=index.mjs.map