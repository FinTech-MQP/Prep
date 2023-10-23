import { useContext } from "react";
import { userContext } from "../App";
import { SECONDARY_COLOR } from "../utils/constants";
import { Box, Typography, Divider } from "@mui/material";
import { WillowButton_Browse } from "../Pages/Browse";
import ImageGrid from "./ImageGrid";

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
    overflow: "hidden",
    padding: "10px",

    "@media (max-width: 1400px)": {
      width: "100%",
    },
  },
  inspectClose: {
    position: "absolute",
    left: "40px",
    top: "15px",
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
  info: {
    height: "100%",
    overflowY: "auto",
    padding: "0 40px 0 40px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "42px",
    fontWeight: 700,
  },
  subtitle: {
    margin: "0 0 5px 0",
    fontSize: "22px",
  },
  desc: {
    fontSize: "22px",
  },
  divider: {
    margin: "15px 0 15px 0",
  },
  label: {
    display: "inline-block",
    backgroundColor: "#ddd",
    borderRadius: "5px",
    padding: "3px 8px",
    margin: "2px",
    fontSize: "24px",
  },
  labelContainer: {
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    margin: "5px 0 5px 0",
    display: "flex",
    flexWrap: "wrap",
  },
  imagesContainer: {
    height: "100%",
    padding: "10px 0 10px 40px",
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
          <Box sx={styles.inspectContentContainer}>
            <Box sx={styles.imagesContainer}>
              <ImageGrid images={user.currListing && user.currListing.images} />
            </Box>
          </Box>
          <Box sx={styles.inspectContentContainer}>
            {user.currListing && (
              <Box sx={styles.info}>
                <Typography sx={styles.title}>
                  {user.currListing.name}
                </Typography>
                <Typography sx={styles.subtitle}>
                  {user.currListing.parcelID} | {user.currListing.address}
                </Typography>
                <Box sx={styles.labelContainer}>
                  {user.currListing.labels &&
                    user.currListing.labels.map((label, index) => (
                      <Typography key={index} sx={styles.label}>
                        {label}
                      </Typography>
                    ))}
                </Box>
                <Divider sx={styles.divider} />
                <Typography sx={styles.desc}>
                  {user.currListing.desc}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Inspect;
