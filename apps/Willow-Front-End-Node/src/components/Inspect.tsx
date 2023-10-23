import { useContext } from "react";
import { userContext } from "../App";
import { SECONDARY_COLOR } from "../utils/constants";
import { Box, Typography } from "@mui/material";
import { WillowButton_Browse } from "../Pages/Browse";

const styles = {
  inspectPseudo: {
    width: "100%",
    height: "calc(100% - 100px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  inspect: {
    position: "absolute",
    backgroundColor: SECONDARY_COLOR,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.6)",
    borderRadius: "5px",
    width: "1400px",
    height: "90%",
    zIndex: 3,
    overflow: "auto",
    padding: "10px",

    "@media (max-width: 1400px)": {
      width: "100%",
    },
  },
  inspectClose: {
    position: "absolute",
  },
  inspectContent: {
    width: "100%",
    height: "calc(100% - 40px)",
    margin: "40px 0 0 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inspectContentContainer: {
    width: "50%",
    height: "100%",
  },
};

interface InspectProps {
  close: () => void;
}

const Inspect = ({ close }: InspectProps) => {
  const user = useContext(userContext);

  return (
    <Box sx={styles.inspectPseudo}>
      <Box sx={styles.inspect}>
        <WillowButton_Browse sx={styles.inspectClose} onClick={close}>
          Return to Browsing
        </WillowButton_Browse>
        <Box sx={styles.inspectContent}>
          <Box sx={styles.inspectContentContainer}></Box>
          <Box sx={styles.inspectContentContainer}>
            {user.currListing && (
              <>
                <Typography>Name: {user.currListing.name}</Typography>
                <Typography>Parcel ID: {user.currListing.parcelID}</Typography>
                <Typography>Address: {user.currListing.address}</Typography>
                <Typography>Desc: {user.currListing.desc}</Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Inspect;
