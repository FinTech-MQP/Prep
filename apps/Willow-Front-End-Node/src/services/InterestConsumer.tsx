import { Listing } from "@monorepo/utils";

export default class InterestConsumer {
  expressInterest = async (listing: Listing): Promise<string> => {
    try {
      const response = await fetch("http://localhost:3001/Interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listing),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      return responseData.message;
    } catch (e: any) {
      console.error("There was a problem expressing interest:", e);
      throw e;
    }
  };
}
