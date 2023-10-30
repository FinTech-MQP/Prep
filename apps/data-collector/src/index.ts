import { prisma } from "database"
import type { Listing } from "database/generated/prisma-client";
import { queryFeatures, IQueryFeaturesOptions, IQueryFeaturesResponse } from "@esri/arcgis-rest-feature-service";
import express, { response } from 'express'

const app = express()

app.use(express.json())

async function getAddressPoint(id: string): Promise<Partial<Listing> | undefined> {
  const options: IQueryFeaturesOptions = {
    url: "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Structures/MapServer/0",
    where: `ADDRESS_ID=${id}`,
    outFields: "*",
    outSR: "4326",
    f: "json"
  }

  return queryFeatures(options).then((response) => {
    if ('features' in response) {
      let feature = response.features[0]
      let attributes = feature.attributes

      let num = attributes?.NUM as number
      let st_name = attributes?.ST_NAME as string
      let zip = attributes?.ZIP as string
      let map_par_id = attributes?.MAP_PAR_ID as string
      
      // get geometry
      if (feature.geometry !== undefined && 'x' in feature.geometry) {
        // geometry is IPoint
        feature.geometry.x
        feature.geometry.y
      }

      let listing: Partial<Listing> = {
        name: `${num} ` + st_name,
        desc: `Worcester Address ${id}`,
        address: `${num} ` + st_name + ", " + zip,
        parcelID: map_par_id,
        images: []
      }

      return listing

    } else {
      // IQueryResponse
      return undefined
    }
  })
}

app.get(`/gis/address/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params
  res.json(await getAddressPoint(id))
})

app.post(`/gis/address/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params

  let listing = await getAddressPoint(id);

  if (listing === undefined) {
    res.status(500);
    res.send({
      error: "Address with that ID was not found"
    });
  } else {
    prisma.listing.create({
      data: {
        ...listing
      }
    }).then(() => {
      res.status(200);
      res.send({
        message: "Successfully added that address to our listings."
      });
    }).catch((error) => {
      res.status(500);
      res.send({
        error: error
      });
    })
  }

  
})

const server = app.listen(2999, () =>
  console.log(`
🚀 Server ready at: http://localhost:2999
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
