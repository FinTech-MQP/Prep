import {
  queryFeatures,
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
} from "@esri/arcgis-rest-feature-service";

import type { Address } from "database/generated/prisma-client";

export interface AddressDataSource {
  fetchAddress(addressId: string): Promise<Address | undefined>;
}

export class AddressAPIDataSource implements AddressDataSource {
  async fetchAddress(addressId: string): Promise<Address | undefined> {
    const options: IQueryFeaturesOptions = {
      url: "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Structures/MapServer/0",
      where: `ADDRESS_ID=${addressId}`,
      outFields: "*",
      outSR: "4326",
      f: "json",
    };

    const response = await queryFeatures(options);
    if ("features" in response) {
      let feature = response.features[0];
      let attributes = feature.attributes;

      // get geometry
      if (feature.geometry !== undefined && "x" in feature.geometry) {
        // geometry is IPoint
        feature.geometry.x;
        feature.geometry.y;
      }

      return {
        id: addressId,
        num: attributes?.NUM as number,
        street: attributes?.STREET as string,
        st_suffix: attributes?.ST_SFX as string,
        city: attributes?.CITY as string,
        zip: attributes?.ZIP as string,
        parcelId: attributes?.MAP_PAR_ID as string,
      };
    } else {
      // IQueryResponse
      return undefined;
    }
  }
}
