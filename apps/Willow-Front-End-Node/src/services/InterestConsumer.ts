import type { Listing } from "database/generated/prisma-client";

export default class InterestConsumer {
  public static expressInterest = async (
    email: string,
    listing: Listing
  ): Promise<string> => {
    try {
      const response = await fetch("http://localhost:3001/Interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, listing }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log(responseData);
      return responseData.message;
    } catch (e: any) {
      console.error("There was a problem expressing interest:", e);
      throw e;
    }
  };
}
