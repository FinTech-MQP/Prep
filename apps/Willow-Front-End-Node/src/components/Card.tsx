import { Box, Typography } from "@mui/material";
import { SECONDARY_COLOR } from "../utils/constants";
import { Listing } from "../utils/interfaces";
import Carousel from "./Carousel";
import { CSSProperties, useContext } from "react";
import { userContext } from "../App";

interface CardProps {
  listing: Listing;
}

const styles: { [key: string]: CSSProperties } = {
  card: {
    position: "relative",
    backgroundColor: SECONDARY_COLOR,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.6)",
    borderRadius: "5px",
    width: "400px",
    height: "340px",
    zIndex: 3,
    overflow: "auto",
    padding: "10px",
    cursor: "pointer",
  },
  pane: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "10px",
    boxSizing: "border-box",
  },
  label: {
    display: "inline-block",
    backgroundColor: "#ddd",
    borderRadius: "5px",
    padding: "3px 8px",
    margin: "2px",
    fontSize: "12px",
  },
  labelContainer: {
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    margin: "5px 0 5px 0",
    display: "flex",
    flexWrap: "wrap",
  },
};

const Card = ({ listing }: CardProps) => {
  const user = useContext(userContext);

  const handleOnClick = () => {
    user.setCurrListing(listing);
    user.setInsecting(true);
  };

  const handleCarouselClick = (event: any) => {
    event.stopPropagation();
  };

  return (
    <Box sx={styles.card} onClick={handleOnClick}>
      <Carousel images={listing.images} onClick={handleCarouselClick} />
      <Box sx={styles.pane}>
        <Box sx={styles.labelContainer}>
          {listing.labels &&
            listing.labels.map((label, index) => (
              <Typography key={index} sx={styles.label}>
                {label}
              </Typography>
            ))}
        </Box>
        <Typography>Name: {listing.name}</Typography>
        <Typography>Parcel ID: {listing.parcelID}</Typography>
        <Typography>Address: {listing.address}</Typography>
      </Box>
    </Box>
  );
};

export default Card;
