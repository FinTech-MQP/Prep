import { SetStateAction, useEffect, useState } from "react";
import Background from "../assets/images/Home Background.jpg";
import { Box, Typography } from "@mui/material";
import {
  DARK_GREY_COLOR,
  SECONDARY_COLOR,
  WILLOW_COLOR,
} from "@monorepo/utils";
import type { Listing } from "database/generated/prisma-client";
import SearchBar from "../components/SearchBar";
import ListingConsumer from "../services/ListingConsumer";

const styles = {
  mainContainer: {
    width: "100%",
    height: "100%",
    overflow: "auto",
    boxSizing: "border-box",
  },
  background: {
    width: "100%",
    height: "60vh",
    backgroundImage: `linear-gradient(to top, rgba(255, 255, 255, 1), transparent),   url(\'${Background}\')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  about: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2.5% 5% 0 5%",

    backgroundImage: `radial-gradient(circle at center, ${WILLOW_COLOR} 0.1rem, transparent 0), radial-gradient(circle at center, ${WILLOW_COLOR} 0.1rem, transparent 0)`,
    backgroundSize: "4rem 4rem",
    backgroundPosition: "0 0, 2rem 2rem",
    backgroundRepeat: "round",
  },
  descHolder: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    color: DARK_GREY_COLOR,
    fontWeight: 700,
    fontSize: "40px",
    backgroundColor: SECONDARY_COLOR,
    padding: "6px",
  },
  desc: {
    color: DARK_GREY_COLOR,
    fontWeight: 400,
    fontSize: "24px",
    backgroundColor: SECONDARY_COLOR,
    padding: "6px",
  },
  cardHolder: {
    width: "fit-content",
    display: "grid",
    placeContent: "center",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "40px",
    boxSizing: "border-box",
    padding: "100px",
    margin: "0 0 100px 0",

    "@media (max-width: 1700px)": {
      gridTemplateColumns: "1fr 1fr",
    },
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
  card: {
    borderRadius: "5px",
    backgroundColor: SECONDARY_COLOR,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    alignItems: "center",
    width: "400px",
    height: "500px",
    padding: "60px 0 60px 0",
  },
  cardTitle: {
    color: DARK_GREY_COLOR,
    fontWeight: 700,
    fontSize: "32px",
  },
  cardDesc: {
    color: DARK_GREY_COLOR,
    fontWeight: 400,
    fontSize: "20px",
  },
};

const cards = [
  { title: "Transparent", desc: "blahh" },
  { title: "Authentic", desc: "blahh" },
  { title: "Durable", desc: "blahh" },
  { title: "Immutable", desc: "blahh" },
];

const Home = () => {
  const [listings, setListings] = useState<Listing[]>();

  useEffect(() => {
    ListingConsumer.getListings().then(
      (result: SetStateAction<Listing[] | undefined>) => {
        setListings(result);
      }
    );
  }, []);

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={styles.background}>
        <SearchBar listings={listings} />
      </Box>
      <Box sx={styles.about}>
        <Box sx={styles.descHolder}>
          <Typography sx={styles.title}>What is Willow?</Typography>
          <Typography sx={styles.desc}>
            The one stop shop for getting your Affordable Housing Project
            developed today! By using
          </Typography>
        </Box>
        <Box sx={styles.cardHolder}>
          {cards.map((card, index) => (
            <Box sx={styles.card} key={index}>
              <Typography sx={styles.cardTitle}>{card.title}</Typography>
              <Typography sx={styles.cardDesc}>{card.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
