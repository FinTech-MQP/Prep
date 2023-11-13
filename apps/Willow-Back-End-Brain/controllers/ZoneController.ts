import express, { Router } from "express";
import { prisma } from "database";

const getZones = async () => {
  let data: any[] = [];
  try {
    data = await prisma.zone.findMany();
  } catch (e: any) {
    console.log(e);
  } finally {
    return data;
  }
};

const router: Router = express.Router();

router.get("/", async (req, res) => {
  res.json(await getZones());
});

export default router;
