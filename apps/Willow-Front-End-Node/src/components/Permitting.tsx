import { Box, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../App";
import { RenderedQuestions } from "./RenderedQuestions";
import { QuestionsMap } from "@monorepo/utils";

const styles = {
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  loadingBox: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const Permitting = () => {
  const user = useContext(userContext);
  const [questionsMap, setQuestionsMap] = useState<QuestionsMap | null>(null);

  useEffect(() => {
    if (user.currListing)
      setQuestionsMap(
        user.currListing.analyses.reduce((acc, item) => {
          acc[item.question] = {
            Answer: item.answer,
            Explanation: item.explanation,
          };
          return acc;
        }, {} as QuestionsMap)
      );
  }, []);

  return (
    <Box sx={styles.mainContainer}>
      {!questionsMap ? (
        <Box sx={styles.loadingBox}>
          <CircularProgress />
        </Box>
      ) : (
        <RenderedQuestions analysis={questionsMap} />
      )}
    </Box>
  );
};

export default Permitting;
