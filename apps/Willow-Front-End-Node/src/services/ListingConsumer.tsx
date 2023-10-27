import { Listing } from "@monorepo/utils";

export default class ListingConsumer {
  public static async getListings(): Promise<Listing[]> {
    try {
      const response = await fetch("http://localhost:3001/Listing");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const listings: Listing[] = await response.json();
      return listings;
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      throw error;
    }
  }
}

export const loadListings = async (): Promise<Listing[] | undefined> => {
  try {
    const listings = await ListingConsumer.getListings();
    return listings as Listing[];
  } catch (e: any) {
    console.log(e);
  }
};
