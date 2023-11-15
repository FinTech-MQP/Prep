import { Box, CircularProgress } from "@mui/material";
import { useContext } from "react";
import { userContext } from "../App";
import { RenderedQuestions } from "./RenderedQuestions";

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

interface PermittingProps {
  isLoading: boolean;
}

const Permitting = ({ isLoading }: PermittingProps) => {
  const user = useContext(userContext);

  return (
    <Box sx={styles.mainContainer}>
      {isLoading ? (
        <Box sx={styles.loadingBox}>
          <CircularProgress />
        </Box>
      ) : (
        <RenderedQuestions analysis={user.currAnalysis} />
      )}
    </Box>
  );
};

export default Permitting;
