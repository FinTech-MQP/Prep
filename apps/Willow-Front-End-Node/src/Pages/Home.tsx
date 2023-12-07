import { SetStateAction, useContext, useEffect, useState } from "react";
import Background from "../assets/images/Home Background.jpg";
import { Box, Typography } from "@mui/material";
import {
  DARK_GREY_COLOR,
  SECONDARY_COLOR,
  WILLOW_COLOR,
} from "@monorepo/utils";
import { ListingPayload } from "database";
import SearchBar from "../components/SearchBar";
import ListingConsumer from "../services/ListingConsumer";

import { MapContainer, Marker, Popup, TileLayer, GeoJSON, Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { userContext } from "../App";
import { useNavigate } from "react-router-dom";

const styles = {
  mainContainer: {
    width: "100%",
    height: "100%",
    overflow: "auto",
    boxSizing: "border-box",
  },
  background: {
    width: "100%",
    height: "40vh",
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
    margin: "20px 100px -20px 100px",
    boxSizing: "border-box",
  },
  cardHolder: {
    width: "fit-content",
    display: "grid",
    placeContent: "center",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "40px",
    boxSizing: "border-box",
    padding: "100px",
    margin: "0 0 60px 0",

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
    width: "380px",
    height: "500px",
    padding: "50px",
    boxSizing: "border-box",
  },
  cardTitle: {
    color: DARK_GREY_COLOR,
    fontWeight: 700,
    fontSize: "32px",
    marginBottom: "15px",
    height: "100px",
  },
  cardDesc: {
    color: DARK_GREY_COLOR,
    fontWeight: 400,
    fontSize: "26px",
  },
};

const cards = [
  {
    title: "Streamlined Site Selection",
    desc: "Cut through complexity with streamlined criteria for site selection, emphasizing accessibility, and zoning compliance.",
  },
  {
    title: "Centralized Data at Your Fingertips",
    desc: "Access zoning details and financial incentives through our all-in-one data repository, simplifying your research process.",
  },
  {
    title: "Smart Decision Support",
    desc: "Our automated system offers instant feedback on potential sites, ensuring regulatory compliance and suitability.",
  },
  {
    title: "Due Diligence, Decoded",
    desc: "Follow our concise checklist to cover all essential due diligence steps, designed to keep your project on track.",
  },
];

const Home = () => {
  const [listings, setListings] = useState<ListingPayload[]>();
  const navigate = useNavigate();
  const user = useContext(userContext);

  const handleSearchAction = (value: any) => {
    if (value && (typeof value === "string" ? value.trim() !== "" : true)) {
      user.setCurrListing(value as ListingPayload);
      user.setInsecting(true);
      navigate("/browse");
    }
  };

  useEffect(() => {
    ListingConsumer.getListings().then(
      (result: SetStateAction<ListingPayload[] | undefined>) => {
        setListings(result);
      }
    );
  }, []);

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={styles.background}>
        <SearchBar listings={listings} />
      </Box>
      <MapContainer
        center={[42.2626, -71.8023]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "50vh", width: "100wh", flex: "1" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings?.map((listing) => {
          return (
            <GeoJSON
              data={JSON.parse(listing.address.parcel.polygonJSON)}
              eventHandlers={{
                click: () => handleSearchAction(listing)
              }}
              key={listing.id}
            >
              <Tooltip>{listing.name}</Tooltip>
            </GeoJSON>
          );
        })}
        <Marker position={[42.2626, 71.8023]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <Box sx={styles.about}>
        <Box sx={styles.descHolder}>
          <Typography sx={styles.title}>
            What is Worcester PermitPro?
          </Typography>
          <Typography sx={styles.desc}>
            Worcester PermitPro is an innovative platform designed to streamline
            the development of affordable housing in Worcester. It features a
            refined set of site selection criteria, focused on key factors like
            transportation access and zoning.
          </Typography>
        </Box>
        <Box sx={styles.cardHolder}>
          {cards.map((card, index) => (
            <Box sx={styles.card} key={index}>
              <Typography sx={styles.cardTitle}>{card.title}</Typography>
              <br />
              <Typography sx={styles.cardDesc}>{card.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
