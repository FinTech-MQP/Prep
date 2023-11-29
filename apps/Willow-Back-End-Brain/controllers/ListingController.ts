import express, { Router } from "express";
import { prisma } from "database";
import { ListingPayload } from "database";

const getListings = async () => {
  let data: ListingPayload[] = [];
  try {
    data = await prisma.listing.findMany({
      include: {
        address: {
          include: {
            parcel: {
              include: {
                assessments: true,
                landUse: true,
                zone: true,
              },
            },
          },
        },
        analyses: true,
      },
    });
  } catch (e: any) {
    console.log(e);
  } finally {
    return data;
  }
};

const router: Router = express.Router();

router.get("/", async (req, res) => {
  res.json(await getListings());
});

export default router;
