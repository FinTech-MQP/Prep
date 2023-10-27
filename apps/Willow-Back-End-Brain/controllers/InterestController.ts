import { Listing } from "@monorepo/utils/interfaces";
import express, { Router, Request, Response } from "express";

const app = express();
const router: Router = express.Router();

app.use(express.json());

router.post("/Interest", (req: Request, res: Response) => {
  const listing: Listing = req.body;
  res.json({
    message: `Interest for Listing: ${listing} expressed successfully!`,
  });
});

export default router;
