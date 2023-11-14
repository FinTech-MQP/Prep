import { useState } from "react";

import { ListingPayload } from "database";
import { QuestionsMap } from "@monorepo/utils/interfaces";

export default function useUserContext() {
  const [currListing, setCurrListing] = useState<ListingPayload | null>(null);
  const [inspecting, setInsecting] = useState<boolean>(false);
  const [currAnalysis, setCurrAnalysis] = useState<QuestionsMap>({});

  const user = {
    currListing,
    setCurrListing,
    inspecting,
    setInsecting,
    currAnalysis,
    setCurrAnalysis,
  };

  return user;
}
