import {
  VisionCardDataSource,
  VisionCardHTMLDataSource,
} from "../vision-property-card/property-card";

import type { Parcel } from "database/generated/prisma-client";

function correctZoneAbbreviation(zoneId: string): string {
  // M-.5 -> M-0.5
  const correctedZoneId = zoneId.replace("-.", "-0.");
  return correctedZoneId;
}

export interface ParcelDataSource {
  fetchParcel(parcelId: string): Promise<Parcel | undefined>;
  fetchImages(parcelId: string): Promise<string[]>;
}

export class ParcelHTMLDataSource implements ParcelDataSource {
  cardSource: VisionCardDataSource = new VisionCardHTMLDataSource();

  async fetchParcel(parcelId: string): Promise<Parcel | undefined> {
    // get data from card
    return await this.cardSource.fetchPage(parcelId).then(($) => {
      // if no page was found, return undefined
      if ($ === undefined) {
        return undefined;
      }

      return {
        id: parcelId,
        sqft: +$("#MainContent_lblLndSf").text(),
        zoneId: correctZoneAbbreviation($("#MainContent_lblZone").text()),
        landUseId: $("#MainContent_lblUseCode").text(),
      };
    });
  }
  async fetchImages(parcelId: string): Promise<string[]> {
    return await this.cardSource.fetchPage(parcelId).then(($) => {
      if ($ === undefined) return [];
      let result: string[] = [];
      $('a[id*="imgPhotoLink"]>img').each((i, e) => {
        let src = $(e).attr("src");
        if (src === undefined) return;
        result.push(src);
      });
      return result;
    });
  }
}
