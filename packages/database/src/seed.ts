import { prisma } from ".";
import fetch from "node-fetch";

// list of address IDs
const DEFAULT_ADDRESSES_TO_LIST = ["24", "1282"];

(async () => {
  try {
    await Promise.all(
      DEFAULT_ADDRESSES_TO_LIST.map(async (addressId) => {
        // create/update address in db
        await fetch(`http://localhost:2999/gis/address/${addressId}`, {
          method: "POST",
        });
        // create/update listing for
        await fetch("http://localhost:2999/api/listing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressId: addressId,
          }),
        });
      })
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
