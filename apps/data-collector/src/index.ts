import { prisma } from "database";
import type { Address } from "database/generated/prisma-client";
import {
  AddressDataSource,
  AddressAPIDataSource,
} from "./data-api/address/address";
import {
  ParcelDataSource,
  ParcelHTMLDataSource,
} from "./data-api/parcel/parcel";
import express, { response } from "express";
import { ZoneAPIDataSource, ZoneDataSource } from "./data-api/zone/zone";
import { LandUseDataSource, LandUseAPIDataSource } from "./data-api/landUse/landUse";
import { AssessmentDataSource, AssessmentHTMLDataSource } from "./data-api/assessment/assessment";

const app = express();

app.use(express.json());

app.get(`/gis/assessment/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;
  const assessmentDataSource: AssessmentDataSource = new AssessmentHTMLDataSource();
  res.json(await assessmentDataSource.fetchAssessments(id));
});

app.get(`/gis/landuse/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;
  const landUseDataSource: LandUseDataSource = new LandUseAPIDataSource();
  res.json(await landUseDataSource.fetchLandUse(id));
});

app.get(`/gis/zone/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;
  const zoneDataSource: ZoneDataSource = new ZoneAPIDataSource();
  res.json(await zoneDataSource.fetchZone(id));
});

app.get(`/gis/parcel/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;
  const parcelDataSource: ParcelDataSource = new ParcelHTMLDataSource();
  res.json(await parcelDataSource.fetchParcel(id));
});

app.get(`/gis/address/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;

  const address = await prisma.address.findUnique({
    where: {
      id: id,
    },
  });

  res.json(address);
});

app.post(`/gis/address/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;

  let addressDataSource: AddressDataSource = new AddressAPIDataSource();

  let listing: Address | undefined = await addressDataSource.fetchAddress(id);

  if (listing === undefined) {
    res.status(500);
    res.send({
      error: "Address with that ID was not found",
    });
  } else {
    prisma.address
      .create({
        data: {
          ...listing,
        },
      })
      .then(() => {
        res.status(200);
        res.send({
          message: "Successfully added that address to our listings.",
        });
      })
      .catch((error: any) => {
        res.status(500);
        res.send({
          error: error,
        });
      });
  }
});

const server = app.listen(2999, () =>
  console.log(`
🚀 Server ready at: http://localhost:2999
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
