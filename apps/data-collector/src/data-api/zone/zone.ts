import {
  queryFeatures,
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
} from "@esri/arcgis-rest-feature-service";

import type { Zone } from "database/generated/prisma-client";

export interface ZoneDataSource {
  fetchZone(zoneId: string): Promise<Zone | undefined>;
}

export class ZoneAPIDataSource implements ZoneDataSource {
  async fetchZone(zoneId: string): Promise<Zone | undefined> {
    const options: IQueryFeaturesOptions = {
      url: "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Regulatory/MapServer/0/",
      where: `ZONE='${zoneId}'`,
      outFields: ["ZONE", "NAME"],
      outSR: "4326",
      returnDistinctValues: true,
      returnGeometry: false,
      f: "json",
    };

    const response = await queryFeatures(options);
    if ("features" in response) {
      let feature = response.features[0];
      if (feature === undefined) {
        return undefined;
      }
      let attributes = feature.attributes;

      return {
        id: zoneId,
        zoneDesc: attributes?.NAME,
      };
    } else {
      // IQueryResponse
      return undefined;
    }
  }
}
