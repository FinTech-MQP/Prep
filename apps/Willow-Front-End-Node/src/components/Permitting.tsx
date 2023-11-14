import { Box, CircularProgress } from "@mui/material";
import { useContext } from "react";
import { userContext } from "../App";
import { RenderedQuestions } from "./RenderedQuestions";

const styles = {
  loadingBox: {
    width: "100%",
    height: "calc(100% - 200px)",
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
    <Box>
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
