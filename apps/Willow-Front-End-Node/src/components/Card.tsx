import { Box, Typography } from "@mui/material";
import { SECONDARY_COLOR } from "@monorepo/utils";
import { ListingPayload } from "database";
import Carousel from "./Carousel";
import { useContext } from "react";
import { userContext } from "../App";

interface CardProps {
  listing: ListingPayload;
}

const styles = {
  card: {
    position: "relative",
    backgroundColor: SECONDARY_COLOR,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.6)",
    borderRadius: "5px",
    width: "400px",
    height: "fit-content",
    zIndex: 3,
    overflow: "auto",
    padding: "10px",
    cursor: "pointer",
  },
  pane: {
    width: "100%",
    height: "100%",
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
    whiteSpace: "nowrap",
  },
  labelContainer: {
    width: "fit-content",
    display: "flex",
    flexDirection: "row",
  },
  labelPseudo: {
    height: "30px",
    margin: "5px 0 5px 0",
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",
    "&::-webskit-scrollbar": {
      display: "none",
    },
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    marginLeft: "2px",
  },
  address: {
    marginLeft: "2px",
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
        <Box sx={styles.labelPseudo}>
          <Box sx={styles.labelContainer}>
            <Typography sx={styles.label}>
              {listing.address.parcel.zoneId}
            </Typography>
            <Typography sx={styles.label}>
              {listing.address.parcelId}
            </Typography>
            <Typography sx={styles.label}>
              {listing.address.parcel.acres.toFixed(2).toLocaleString() +
                " acres"}
            </Typography>
          </Box>
        </Box>
        <Typography sx={styles.title}>
          {listing.name
            .toLowerCase()
            .replace(/\b(\w)/g, (s) => s.toUpperCase())}
        </Typography>
        <Typography sx={styles.address}>{/*listing.address*/}</Typography>
      </Box>
    </Box>
  );
};

export default Card;
