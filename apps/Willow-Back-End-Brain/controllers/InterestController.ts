import { ListingPayload } from "database";
import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const email = req.body.email;
  const listing: ListingPayload = req.body.listing;

  if (!email || !listing) {
    return res.status(400).json({
      message: "Both email and listing are required.",
    });
  }

  res.json({
    message: `Interest for Listing: ${listing.name} by ${email} expressed successfully!`,
  });
});

export default router;
