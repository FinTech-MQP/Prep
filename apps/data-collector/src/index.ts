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

const app = express();

app.use(express.json());

app.get(`/gis/parcel/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;
  const parcelDataSource: ParcelDataSource = new ParcelHTMLDataSource();
  res.json(parcelDataSource.fetchParcel(id));
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
