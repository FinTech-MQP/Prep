import { useContext, useEffect, useState } from "react";
import GitHubLabel from "../components/GitHubLabel";
import { Box, Button, ButtonProps } from "@mui/material";
import styled from "@emotion/styled";
import { SECONDARY_COLOR, WILLOW_COLOR } from "../utils/constants";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { userContext } from "../App";
import { LabelType, Listing } from "../utils/interfaces";
import { loadListings } from "../services/ListingConsumer";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import Inspect from "../components/Inspect";

const styles = {
  mainContainer: {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  },
  topBar: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    height: "100px",
    width: "100%",
    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
    padding: "20px 20px 0 20px",
    boxSizing: "border-box",
    zIndex: 2,
  },
  contentHolder: {
    display: "flex",
    flexDirection: "row",
    height: "calc(100% - 200px)",
    width: "100%",
    overflow: "hidden",

    backgroundImage: `radial-gradient(circle at center, ${WILLOW_COLOR} 0.1rem, transparent 0), radial-gradient(circle at center, ${WILLOW_COLOR} 0.1rem, transparent 0)`,
    backgroundSize: "4rem 4rem",
    backgroundPosition: "0 0, 2rem 2rem",
    backgroundRepeat: "round",
  },
  search: {
    width: "30%",
  },
  gitHubPseudo: {
    margin: "0 40px 40px 40px",
  },
  filterPseudo: {
    position: "relative",
    height: "100%",
    width: "fit-content",
    padding: "30px 30px 0 0",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 0,
    scrollbarWidth: "none",
    "&::-webskit-scrollbar": {
      display: "none",
    },
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    rowGap: "20px",
    columnGap: "10px",
    margin: "0 0 200px 0",
  },
  close: {
    height: "100px",
    minWidth: "40px !important",
    boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.2)",
    position: "absolute",
    right: 0,
    top: "calc(50% - 100px)",
    padding: 0,
    zIndex: 1,
  },
};

interface FilterBoxProps extends ButtonProps {
  open: boolean;
}

const FilterBox = styled(Box)<FilterBoxProps>`
  background-color: ${SECONDARY_COLOR};
  z-index: 1;
  position: relative;
  width: fit-content;
  height: 100%;
  box-shadow: 1px -1px 1px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  transition: transform 0.3s ease-in;
  transform: ${(props) =>
    props.open ? "none" : "translateX(calc(-100% + 50px))"};
`;

const CardBox = styled(Box)<FilterBoxProps>`
  position: absolute;
  right: 0;
  width: ${(props) =>
    props.open ? "calc(100% - 330px)" : "calc(100% - 50px)"};
  height: 100%;
  overflow-y: auto;
  padding: 40px;
  box-sizing: border-box;
  transition: width 0.3s ease-in, transform 0.3s ease-in;
  gap: 20px;
  z-index: 0;
`;

export const WillowButton_Browse = styled(Button)({
  borderRadius: 0,
  color: WILLOW_COLOR,
  "&:hover": {
    backgroundColor: "white",
  },
  "& .MuiTouchRipple-root": {
    color: WILLOW_COLOR,
  },
});

const labels: LabelType[] = [
  {
    name: "good first issue",
    color: "#7057ff",
    description: "Good for newcomers",
  },
  {
    name: "help wanted",
    color: "#008672",
    description: "Extra attention is needed",
  },
  {
    name: "priority: critical",
    color: "#b60205",
    description: "",
  },
  {
    name: "priority: high",
    color: "#d93f0b",
    description: "",
  },
  {
    name: "priority: low",
    color: "#0e8a16",
    description: "",
  },
  {
    name: "priority: medium",
    color: "#fbca04",
    description: "",
  },
  {
    name: "status: can't reproduce",
    color: "#fec1c1",
    description: "",
  },
  {
    name: "status: confirmed",
    color: "#215cea",
    description: "",
  },
  {
    name: "status: duplicate",
    color: "#cfd3d7",
    description: "This issue or pull request already exists",
  },
  {
    name: "status: needs information",
    color: "#fef2c0",
    description: "",
  },
  {
    name: "status: wont do/fix",
    color: "#eeeeee",
    description: "This will not be worked on",
  },
  {
    name: "type: bug",
    color: "#d73a4a",
    description: "Something isn't working",
  },
  {
    name: "type: discussion",
    color: "#d4c5f9",
    description: "",
  },
  {
    name: "type: documentation",
    color: "#006b75",
    description: "",
  },
  {
    name: "type: enhancement",
    color: "#84b6eb",
    description: "",
  },
  {
    name: "type: epic",
    color: "#3e4b9e",
    description: "A theme of work that contain sub-tasks",
  },
  {
    name: "type: feature request",
    color: "#fbca04",
    description: "New feature or request",
  },
  {
    name: "type: question",
    color: "#d876e3",
    description: "Further information is requested",
  },
];

interface FilterType {
  title: string;
  desc: string;
  labels: LabelType[];
}

const filters: FilterType[] = [
  { title: "Filter Set #1", desc: "Filter Set #1 Description", labels: labels },
  { title: "Filter Set #2", desc: "Filter Set #2 Description", labels: labels },
  { title: "Filter Set #3", desc: "Filter Set #3 Description", labels: labels },
  { title: "Filter Set #4", desc: "Filter Set #4 Description", labels: labels },
  { title: "Filter Set #5", desc: "Filter Set #5 Description", labels: labels },
  { title: "Filter Set #6", desc: "Filter Set #6 Description", labels: labels },
  { title: "Filter Set #7", desc: "Filter Set #7 Description", labels: labels },
  { title: "Filter Set #8", desc: "Filter Set #8 Description", labels: labels },
  { title: "Filter Set #9", desc: "Filter Set #9 Description", labels: labels },
  {
    title: "Filter Set #10",
    desc: "Filter Set #10 Description",
    labels: labels,
  },
];

const Browse = () => {
  const user = useContext(userContext);

  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [listings, setListings] = useState<Listing[]>();

  useEffect(() => {
    loadListings().then((result) => {
      setListings(result);
    });
  }, []);

  const toggleFilter = () => setFiltersOpen(!filtersOpen);
  const inspectClose = () => user.setInsecting(false);

  return (
    <Box sx={styles.mainContainer}>
      {user.inspecting && <Inspect close={inspectClose} />}
      <Box sx={styles.topBar}>
        <SearchBar listings={listings} />
      </Box>
      <Box sx={styles.contentHolder}>
        <FilterBox open={filtersOpen}>
          <WillowButton_Browse sx={styles.close} onClick={toggleFilter}>
            {filtersOpen ? (
              <ArrowBackIosIcon color="inherit" />
            ) : (
              <ArrowForwardIosIcon color="inherit" />
            )}
          </WillowButton_Browse>
          <Box sx={styles.filterPseudo}>
            {filters.map((filter, index) => (
              <Box sx={styles.gitHubPseudo} key={index}>
                <GitHubLabel
                  title={filter.title}
                  desc={filter.desc}
                  labels={filter.labels}
                />
              </Box>
            ))}
            <Box sx={styles.gitHubPseudo}>
              <WillowButton_Browse>Clear All</WillowButton_Browse>
            </Box>
          </Box>
        </FilterBox>
        <CardBox open={filtersOpen}>
          <Box sx={styles.cards}>
            {listings &&
              listings.map((listing, index) => (
                <Card key={index} listing={listing} />
              ))}
          </Box>
        </CardBox>
      </Box>
    </Box>
  );
};

export default Browse;
