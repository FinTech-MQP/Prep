import type { Listing } from "database/generated/prisma-client";

export default class ListingConsumer {
  public static async getListings(): Promise<Listing[] | undefined> {
    try {
      const response = await fetch("http://localhost:3001/Listing");
      if (!response.ok) {
        console.error("Network response was not ok");
        return undefined;
      }
      const listings: Listing[] = await response.json();
      //console.log(listings);
      return listings;
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      return undefined;
    }
  }
}
