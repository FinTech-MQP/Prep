import { useState } from "react";

import { ListingPayload } from "database";

export default function useUserContext() {
  const [currListing, setCurrListing] = useState<ListingPayload | null>(null);
  const [inspecting, setInsecting] = useState<boolean>(false);

  const user = {
    currListing,
    setCurrListing,
    inspecting,
    setInsecting,
  };

  return user;
}
