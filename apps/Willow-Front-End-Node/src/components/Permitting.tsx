import { Box, CircularProgress, Typography } from "@mui/material";
import OpenAI_API from "../services/APIConsumer";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../App";

const styles = {
  loadingBox: {
    width: "100%",
    height: "calc(100% - 200px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const Pertmitting = () => {
  const user = useContext(userContext);
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if (user.currListing)
      OpenAI_API.analyze(user.currListing).then((result: string) => {
        setAnalysis(result);
        setIsLoading(false);
      });
  }, []);

  return (
    <Box>
      {isLoading ? (
        <Box sx={styles.loadingBox}>
          <CircularProgress />
        </Box>
      ) : (
        <Typography>{analysis}</Typography>
      )}
    </Box>
  );
};

export default Pertmitting;
