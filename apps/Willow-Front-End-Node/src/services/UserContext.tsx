import { useState } from "react";
import type { Listing } from "database/generated/prisma-client";

export default function useUserContext() {
  const [currListing, setCurrListing] = useState<Listing | null>(null);
  const [inspecting, setInsecting] = useState<boolean>(false);

  const user = {
    currListing,
    setCurrListing,
    inspecting,
    setInsecting,
  };

  return user;
}
