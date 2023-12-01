import {
  IQueryFeaturesOptions,
  queryFeatures,
  IQueryFeaturesResponse,
} from "@esri/arcgis-rest-feature-service";

import fetch from "cross-fetch";

export async function updateAllParcels() {
  const zoningUrl =
    "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Regulatory/MapServer/0/query";
  const parcelUrl =
    "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Property/MapServer/1/query";

  try {
    // Query zoning polygons for ZONE='RG-5' using POST request
    const zoningQuery = `where=ZONE='RG-5'&returnGeometry=true&outFields=*&outSR=4326&f=json`;

    const zoningResponse = await fetch(zoningUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(zoningQuery),
    });

    if (!zoningResponse.ok) {
      throw new Error(
        `Failed to fetch zoning data. Status: ${zoningResponse.status}`
      );
    }

    const zoningData = (await zoningResponse.json()) as any;
    console.log(JSON.stringify(zoningData));
    const rg5Zones = zoningData.features.map(
      (feature: any) => feature.geometry
    );

    // Query parcel polygons within RG-5 zones using POST request
    const rg5ParcelsQuery = `geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&geometry=${JSON.stringify(rg5Zones
    )}&returnGeometry=true&outFields=*&f=json`;

    const rg5ParcelsResponse = await fetch(parcelUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(rg5ParcelsQuery),
    });

    if (!rg5ParcelsResponse.ok) {
      throw new Error(
        `Failed to fetch parcel data within RG-5 zones. Status: ${rg5ParcelsResponse.status}`
      );
    }

    const rg5ParcelsData = (await rg5ParcelsResponse.json()) as any;

    console.log(JSON.stringify(rg5ParcelsData));

    const rg5Parcels = rg5ParcelsData.features.map(
      (feature: any) => feature.geometry
    );

    // Handle rg5Parcels data here...
    console.log("Parcels within RG-5 zones:", rg5Parcels);
  } catch (error) {
    console.error("Error:", error);
  }
}

// export async function updateAllParcels() {
//   // get RG-5 zones
//   const zoningOptions: IQueryFeaturesOptions = {
//     url: "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Regulatory/MapServer/0",
//     httpMethod: 'POST',
//     where: `ZONE='RG-5'`,
//     outFields: "*",
//     outSR: "4326",
//     returnGeometry: true,
//     f: "json",
//   };

//   await queryFeatures(zoningOptions).then((zoningResponse) => {
//     if ("features" in zoningResponse) {
//       zoningResponse.features.forEach(async (feature) => {
//         if (feature.geometry === undefined) return;

//         let parcelOptions: IQueryFeaturesOptions = {
//           url: "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Property/MapServer/1",
//           httpMethod: 'POST',
//           where: '1=1',
//           geometry: feature.geometry,
//           outFields: "*",
//           spatialRel: "esriSpatialRelContains",
//           inSR: "4326",
//           returnGeometry: true,
//           outSR: "4326",
//           f: "geojson",
//         };

//         await queryFeatures(parcelOptions).then((parcelResponse) => {
//           if ("features" in parcelResponse) {
//             parcelResponse.features.forEach((feature) => {
//                 console.log(feature);
//             });
//           }
//         });
//       });
//     }
//   });

//   // find parcel polygons within RG-5 zones

//   // add each to database and create listing
// }
