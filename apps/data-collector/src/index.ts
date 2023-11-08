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
import {
  LandUseDataSource,
  LandUseAPIDataSource,
} from "./data-api/landUse/landUse";
import {
  AssessmentDataSource,
  AssessmentHTMLDataSource,
} from "./data-api/assessment/assessment";

const app = express();

app.use(express.json());

/*

------------------------------------------
The below endpoints are for local testing.

TODO: All data collection logic should be
      put on periodically running tasks
------------------------------------------

*/

app.get(`/api/listing/:id`, async (req, res) => {
  let { id }: { id?: string } = req.params;
  res.json(
    await prisma.listing.findFirst({
      where: {
        id: id,
      },
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
      },
    })
  );
});

app.get(`/api/listing`, async (req, res) => {
  res.json(
    await prisma.listing.findMany({
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
      },
    })
  );
});

app.post(`/api/listing`, async (req, res) => {
  let addressId = req.body.addressId as string | undefined;
  if (addressId === undefined)
    return res.json({ error: "No address ID provided for the listing." });

  let parcelDataSource: ParcelDataSource = new ParcelHTMLDataSource();

  let address = await prisma.address.findFirst({
    where: {
      id: addressId,
    },
  });

  if (address === null)
    return res.json({
      error: `An address with ID: ${addressId} was not found.`,
    });

  let data = {
    name: `${address.num} ${address.street} ${address.st_suffix}`,
    desc: `Property description for ${address.num} ${address.street} ${address.st_suffix}, ${address.city} ${address.zip}`,
    images: await parcelDataSource.fetchImages(address.parcelId),
    labels: [],
    addressId: addressId,
  };

  await prisma.listing
    .upsert({
      where: {
        addressId: addressId,
      },
      update: {
        ...data,
      },
      create: {
        ...data,
      },
    })
    .then(() => {
      console.log(`Created listing for addressId:${addressId}`);
      return res.json({
        message: "Successfully added/updated that address to our listings.",
      });
    })
    .catch((err) => {
      return res.json({ error: err });
    });
});

app.get(`/gis/assessment/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;
  const assessmentDataSource: AssessmentDataSource =
    new AssessmentHTMLDataSource();
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
  let parcelDataSource: ParcelDataSource = new ParcelHTMLDataSource();
  let zoneDataSource: ZoneDataSource = new ZoneAPIDataSource();
  let landUseDataSource: LandUseDataSource = new LandUseAPIDataSource();
  let assessmentDataSource: AssessmentDataSource =
    new AssessmentHTMLDataSource();

  let address = await addressDataSource.fetchAddress(id);
  if (address === undefined) {
    return res.json({ error: `Address ID ${id} not found` });
  }

  let parcel = await parcelDataSource.fetchParcel(address.parcelId);
  if (parcel === undefined) {
    return res.json({ error: `Parcel ${address.parcelId} not found` });
  }

  let zone = await zoneDataSource.fetchZone(parcel.zoneId);
  if (zone === undefined) {
    return res.json({ error: `Zone ${parcel.zoneId} not found` });
  }

  let landUse = await landUseDataSource.fetchLandUse(parcel.landUseId);
  if (landUse === undefined) {
    return res.json({ error: `LandUse ${parcel.landUseId} not found` });
  }

  let assessments = await assessmentDataSource.fetchAssessments(parcel.id);
  if (assessments === undefined) {
    return res.json({ error: `Assessments for ${parcel.id} not found` });
  }

  // all data is collected + errors are handled
  console.log(
    `Attempting to save associated address data for addressId:${address.id}...`
  );
  try {
    await prisma.landUse.upsert({
      where: {
        id: landUse.id,
      },
      update: {
        ...landUse,
      },
      create: {
        ...landUse,
      },
    });

    await prisma.zone.upsert({
      where: {
        id: zone.id,
      },
      update: {
        ...zone,
      },
      create: {
        ...zone,
      },
    });

    await prisma.parcel.upsert({
      where: {
        id: parcel.id,
      },
      update: {
        ...parcel,
      },
      create: {
        ...parcel,
      },
    });

    assessments.forEach(async (assessment) => {
      await prisma.assessment.upsert({
        where: {
          assessmentIdentifier: {
            parcelId: assessment.parcelId,
            year: assessment.year,
          },
        },
        update: {
          ...assessment,
        },
        create: {
          ...assessment,
        },
      });
    });

    await prisma.address.upsert({
      where: {
        id: address.id,
      },
      update: {
        ...address,
      },
      create: {
        ...address,
      },
    });

    const addressCollected = await prisma.address.findFirst({
      where: {
        id: address.id,
      },
      include: {
        parcel: {
          include: {
            zone: true,
            landUse: true,
            assessments: true,
          },
        },
      },
    });
    console.log(`All data for addressId:${address.id} saved successfully.`);
    return res.json(addressCollected);
  } catch (err) {
    return res.json({ msg: "Error in updating database", err: err });
  }
});

const server = app.listen(2999, () =>
  console.log(`
🚀 Server ready at: http://localhost:2999
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
