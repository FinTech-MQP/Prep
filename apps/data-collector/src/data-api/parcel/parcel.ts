import {
  VisionCardDataSource,
  VisionCardHTMLDataSource,
} from "../vision-property-card/property-card";

import type { Parcel } from "database/generated/prisma-client";

export interface ParcelDataSource {
  fetchParcel(parcelId: string): Promise<Parcel | undefined>;
}

export class ParcelHTMLDataSource implements ParcelDataSource {
  async fetchParcel(parcelId: string): Promise<Parcel | undefined> {
    const cardSource: VisionCardDataSource = new VisionCardHTMLDataSource();

    // get data from card
    return await cardSource.fetchPage(parcelId).then(($) => {
      // if no page was found, return undefined
      if ($ === undefined) {
        return undefined;
      }

      return {
        id: parcelId,
        sqft: +$("#MainContent_lblLndSf").text(),
        zoneId: $("#MainContent_lblZone").text(),
        landUseId: $("#MainContent_lblUseCode").text(),
      };
    });
  }
}
