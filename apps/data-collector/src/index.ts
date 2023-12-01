import express, { request, response } from "express";
import { ListingPayload, prisma } from "database";
import {
  AddressDataSource,
  AddressAPIDataSource,
} from "./data-api/address/address";
import {
  ParcelDataSource,
  ParcelHTMLDataSource,
} from "./data-api/parcel/parcel";
import { ZoneAPIDataSource, ZoneDataSource } from "./data-api/zone/zone";
import {
  LandUseDataSource,
  LandUseAPIDataSource,
} from "./data-api/landUse/landUse";
import {
  AssessmentDataSource,
  AssessmentHTMLDataSource,
} from "./data-api/assessment/assessment";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "@monorepo/utils/API_KEY";
//import { OPENAI_ASSISTANT_ID } from "@monorepo/utils/constants";
import {
  ParcelPolygonAPIDataSource,
  ParcelPolygonDataSource,
} from "./data-api/parcel/parcelPolygon";
import { updateAllParcels } from "./scheduled";
import { AnalysisAPIDataSource, AnalysisDataSource } from "./data-api/analysis";
import {
  FloodZoneAPIDataSource,
  FloodZoneDataSource,
} from "./data-api/floodZone/floodZone";

const app = express();

app.use(express.json());

async function findListing(listingId: string): Promise<ListingPayload | null> {
  return await prisma.listing.findFirst({
    where: {
      id: listingId,
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
      analyses: true,
    },
  });
}

/*

------------------------------------------
The below endpoints are for local testing.

TODO: All data collection logic should be
      put on periodically running tasks
------------------------------------------

*/

app.get(`/api/listing/update`, async (req, res) => {
  updateAllParcels();
  return res.json({ msg: "Called function." });
});

app.get(`/api/listing/:id`, async (req, res) => {
  let { id }: { id?: string } = req.params;
  res.json(await findListing(id));
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
        analyses: true,
      },
    })
  );
});

app.post(`/api/listing`, async (req, res) => {
  let addressId = req.body.addressId as string | number | undefined;
  if (addressId === undefined)
    return res.json({ error: "No address ID provided for the listing." });
  if (typeof addressId === "number") {
    return res.json({ error: "Address ID was a number, expected a string" });
  }

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

  //description generator function here
  try {
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
      .then(async (result) => {
        console.log(
          `Created listing for addressId:${addressId} ... generating analysis`
        );
        // // once the listing is created, create the analysis on the listing
        // let analysisDataSource: AnalysisDataSource =
        //   new AnalysisAPIDataSource();

        // let createdListing = await findListing(result.id);
        // if (createdListing === null) {
        //   // listing was not created
        //   return;
        // }

        // // generate description
        // let generatedDescription =
        //   await analysisDataSource.generateDescription(createdListing);

        // if (generatedDescription === undefined)
        //   generatedDescription = createdListing.desc;

        // // update new description
        // await prisma.listing.update({
        //   where: {
        //     id: createdListing.id,
        //   },
        //   data: {
        //     desc: generatedDescription,
        //   },
        // });

        // // generate analysis
        // let analyses =
        //   await analysisDataSource.generateAnalysis(createdListing);
        // console.log(analyses);
        // if (analyses === undefined) return;

        // // clear old analysis

        // await prisma.analysis.deleteMany({
        //   where: {
        //     listingId: createdListing.id,
        //   },
        // });

        // // enter new analysis

        // await prisma.analysis.createMany({ data: analyses });

        return res.json({
          message: "Successfully added/updated that address to our listings.",
        });
      })
      .catch((err) => {
        return res.json({ error: err });
      });
  } catch (e: any) {
    console.log(e);
  }
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
  let parcelPolygonSource: ParcelPolygonDataSource =
    new ParcelPolygonAPIDataSource();
  let polygon = await parcelPolygonSource.fetchParcelPolygon(id);
  if (polygon === undefined) {
    return undefined;
  }
  res.json(await parcelDataSource.fetchParcel(id, undefined, polygon));
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
  let floodZoneDataSource: FloodZoneDataSource = new FloodZoneAPIDataSource();
  let parcelPolygonSource: ParcelPolygonDataSource =
    new ParcelPolygonAPIDataSource();
  let zoneDataSource: ZoneDataSource = new ZoneAPIDataSource();
  let landUseDataSource: LandUseDataSource = new LandUseAPIDataSource();
  let assessmentDataSource: AssessmentDataSource =
    new AssessmentHTMLDataSource();

  let address = await addressDataSource.fetchAddress(id);
  if (address === undefined) {
    return res.json({ error: `Address ID ${id} not found` });
  }

  let parcelPolygon = await parcelPolygonSource.fetchParcelPolygon(
    address.parcelId
  );
  if (parcelPolygon === undefined) {
    return res.json({
      error: `Parcel polygon for parcel ${address.parcelId} not found`,
    });
  }
  let floodZone = await floodZoneDataSource.getFloodZone(parcelPolygon);

  let parcel = await parcelDataSource.fetchParcel(
    address.parcelId,
    floodZone,
    parcelPolygon
  );
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

    if (floodZone !== undefined) {
      let floodZonePolygonStr = floodZone.polygonJSON;

      await prisma.$executeRaw`INSERT INTO "public"."FloodZone" 
      (id, "zoneName", floodway, "specialFloodHazardArea", polygon, "polygonJSON") 
      VALUES (${floodZone.id}, ${floodZone.zoneName}, ${floodZone.floodway}, ${floodZone.specialFloodHazardArea}, ST_GeomFromGeoJSON(${floodZonePolygonStr}), ${floodZonePolygonStr})
      ON CONFLICT(id) DO UPDATE
      SET id=${floodZone.id}, "zoneName"=${floodZone.zoneName}, floodway=${floodZone.floodway}, "specialFloodHazardArea"=${floodZone.specialFloodHazardArea}, polygon=ST_GeomFromGeoJSON(${floodZonePolygonStr}), "polygonJSON"=${floodZonePolygonStr}`;
    }

    let parcelPolygonStr = parcel.polygonJSON;

    await prisma.$executeRaw`INSERT INTO "public"."Parcel" (id, sqft, "zoneId", "landUseId", acres, polygon, "polygonJSON", "femaFloodZoneId") 
    VALUES(${parcel.id}, ${parcel.sqft}, ${parcel.zoneId}, ${parcel.landUseId}, ${parcel.acres}, ST_GeomFromGeoJSON(${parcelPolygonStr}), ${parcelPolygonStr}, ${floodZone?.id})
    ON CONFLICT(id) DO UPDATE 
    SET sqft=${parcel.sqft}, "zoneId"=${parcel.zoneId}, "landUseId"=${parcel.landUseId}, acres=${parcel.acres}, polygon=ST_GeomFromGeoJSON(${parcelPolygonStr}), "polygonJSON"=${parcelPolygonStr}, "femaFloodZoneId"=${floodZone?.id}`;

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
