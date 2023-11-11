import { ListingPayload } from "database";

export default class ListingConsumer {
  public static async getListings(): Promise<ListingPayload[] | undefined> {
    try {
      const response = await fetch("http://localhost:3001/Listing");
      if (!response.ok) {
        console.error("Network response was not ok");
        return undefined;
      }
      const listings: ListingPayload[] = await response.json();
      //console.log(listings);
      return listings;
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      return undefined;
    }
  }
}
