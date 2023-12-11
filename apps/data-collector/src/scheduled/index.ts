import {
  IQueryFeaturesOptions,
  queryFeatures,
  IFeature,
} from "@esri/arcgis-rest-feature-service";

export async function updateAllParcels() {
  const zoningUrl =
    "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Regulatory/MapServer/0/query";
  const parcelUrl =
    "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Property/MapServer/1/query";

  const zoningOptions: IQueryFeaturesOptions = {
    url: zoningUrl,
    httpMethod: "POST",
    where: `ZONE='RG-5'`,
    outSR: "4326",
    returnGeometry: true,
    outFields: "*",
  };

  try {
    // Query zoning polygons for ZONE='RG-5' using POST request
    const rg5Zones = await queryFeatures(zoningOptions).then((result) => {
      if ("features" in result) {
        return result.features;
      } else {
        return [];
      }
    });

    console.log(`RG-5 Zones Found: ${rg5Zones.length}`);

    // For each RG-5 zone, find parcels within it
    const rg5Parcels: IFeature[] = [];

    await Promise.all(
      rg5Zones.map(async (zoningFeature) => {
        await queryFeatures({
          url: parcelUrl,
          httpMethod: "POST",
          where: "1=1",
          inSR: "4326",
          geometry: zoningFeature.geometry,
          geometryType: "esriGeometryPolygon",
          spatialRel: "esriSpatialRelContains",
          returnGeometry: true,
          outSR: "4326",
          outFields: "*",
        }).then((result) => {
          if ("features" in result) {
            result.features.forEach((parcelFeature) => {
              rg5Parcels.push(parcelFeature);
            });
          }
        });
      })
    );

    // For each parcel, output its result
    console.log(`Parcels found: ${rg5Parcels.length}`);
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
