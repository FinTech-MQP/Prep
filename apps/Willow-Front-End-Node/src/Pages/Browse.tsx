import { SetStateAction, useContext, useEffect, useState } from "react";
import GitHubLabel from "../components/GitHubLabel";
import { Box, Button, ButtonProps, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import { SECONDARY_COLOR, WILLOW_COLOR } from "@monorepo/utils";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { userContext } from "../App";
import { LabelType } from "@monorepo/utils";
import type { Listing } from "database/generated/prisma-client";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import Inspect from "../components/Inspect";
import ListingConsumer from "../services/ListingConsumer";

const styles = {
  loadingBox: {
    width: "100%",
    height: "calc(100% - 200px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
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
  transition:
    width 0.3s ease-in,
    transform 0.3s ease-in;
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

const zoningLabels: LabelType[] = [
  {
    name: "Residential",
    color: "#7057ff",
    description: "Zoned for residential development",
  },
  {
    name: "Commercial",
    color: "#d62d20",
    description: "Zoned for commercial businesses and retail spaces",
  },
  {
    name: "Industrial",
    color: "#ffa700",
    description:
      "Zoned for manufacturing, factories, and other industrial uses",
  },
  {
    name: "Agricultural",
    color: "#008744",
    description: "Zoned for farming and agriculture-related activities",
  },
  {
    name: "Mixed-Use",
    color: "#0057e7",
    description:
      "Allows for a mix of residential, commercial, and sometimes industrial uses",
  },
  {
    name: "Recreational",
    color: "#d6dae0",
    description: "Zoned for parks, open spaces, and recreational activities",
  },
  {
    name: "Public Use",
    color: "#8e44ad",
    description: "Land reserved for public utilities, schools, hospitals, etc.",
  },
  {
    name: "Historical",
    color: "#e67e22",
    description:
      "Areas with significant historical importance, may have development restrictions",
  },
  {
    name: "Conservation",
    color: "#16a085",
    description:
      "Zones meant for protecting natural environments, may restrict many types of development",
  },
  {
    name: "Overlay",
    color: "#c0392b",
    description:
      "Special provisions that are superimposed over base zones, might include additional restrictions or allowances",
  },
];

const legalLabels: LabelType[] = [
  {
    name: "Clear Title",
    color: "#4CAF50",
    description: "Land with documented ownership and no disputes",
  },
  {
    name: "Disputed",
    color: "#F44336",
    description: "Land with ongoing legal disputes over ownership or rights",
  },
  {
    name: "Permitted",
    color: "#8BC34A",
    description: "Land with necessary permits for certain types of development",
  },
  {
    name: "Restrictions",
    color: "#FFC107",
    description: "Land with certain development or usage restrictions in place",
  },
  {
    name: "Easements",
    color: "#FF9800",
    description:
      "Land with a right of way granted to another party, like utilities or access rights",
  },
];

const developmentLabels: LabelType[] = [
  {
    name: "Raw Land",
    color: "#607D8B",
    description: "Untouched land with no improvements or infrastructure",
  },
  {
    name: "Partially Developed",
    color: "#FFEB3B",
    description: "Land with some improvements, such as roads or utilities",
  },
  {
    name: "Fully Developed",
    color: "#4CAF50",
    description: "Land with complete infrastructure and ready for construction",
  },
  {
    name: "Reclaimed",
    color: "#00BCD4",
    description:
      "Previously developed or used land that has been restored or repurposed",
  },
];

const topographyLabels: LabelType[] = [
  {
    name: "Flat",
    color: "#8BC34A",
    description:
      "Land with minimal elevation change, suitable for most types of development",
  },
  {
    name: "Hilly",
    color: "#FFEB3B",
    description:
      "Land with varied elevations, might require additional considerations for development",
  },
  {
    name: "Mountainous",
    color: "#FF9800",
    description: "Rugged land with significant elevation changes",
  },
  {
    name: "Waterfront",
    color: "#03A9F4",
    description: "Land adjacent to a body of water, like a lake, river, or sea",
  },
  {
    name: "Wetlands",
    color: "#009688",
    description:
      "Areas that are saturated with water, either seasonally or permanently",
  },
];

const environmentLabels: LabelType[] = [
  {
    name: "Wooded",
    color: "#4CAF50",
    description: "Land with significant tree cover or forests",
  },
  {
    name: "Desert",
    color: "#FFC107",
    description: "Arid land with sparse vegetation",
  },
  {
    name: "Protected Area",
    color: "#9C27B0",
    description: "Areas designated for conservation or wildlife protection",
  },
  {
    name: "Polluted",
    color: "#F44336",
    description: "Areas that might have contamination or environmental hazards",
  },
  {
    name: "Fertile",
    color: "#8BC34A",
    description: "Land suitable for agriculture or gardening due to rich soil",
  },
];

interface FilterType {
  title: string;
  desc: string;
  labels: LabelType[];
}

const filters: FilterType[] = [
  { title: "Zoning", desc: "Filter by zoning", labels: zoningLabels },
  { title: "Legal", desc: "Filter by legal status", labels: legalLabels },
  {
    title: "Development",
    desc: "Filter by development level",
    labels: developmentLabels,
  },
  { title: "Topgraphy", desc: "Filter by topgraphy", labels: topographyLabels },
  {
    title: "Environment",
    desc: "Filter by environmetal features",
    labels: environmentLabels,
  },
];

const Browse = () => {
  const user = useContext(userContext);

  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [listings, setListings] = useState<Listing[]>();
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [segregatedFilters, setSegregatedFilters] = useState<
    Record<string, string[]>
  >({
    Zoning: [],
    Legal: [],
    Development: [],
    Topgraphy: [],
    Environment: [],
  });

  useEffect(() => {
    setIsLoading(true);
    ListingConsumer.getListings().then(
      (result: SetStateAction<Listing[] | undefined>) => {
        setListings(result);
        setIsLoading(false);
      }
    );
  }, []);

  const toggleFilter = () => setFiltersOpen(!filtersOpen);
  const inspectClose = () => user.setInsecting(false);

  useEffect(() => {
    updateSegregatedFiltersBasedOn(appliedFilters);
  }, [appliedFilters]);

  const handleLabelClick = (selectedLabels: LabelType[]) => {
    setAppliedFilters((prevFilters) => {
      const filtersSet = new Set(prevFilters);
      const selectedLabelsSet = new Set(selectedLabels.map((l) => l.name));

      selectedLabels.forEach((clickedLabel) => {
        filtersSet.add(clickedLabel.name);
      });

      for (let filter of filtersSet) {
        if (!selectedLabelsSet.has(filter)) {
          filtersSet.delete(filter);
        }
      }

      const updatedAppliedFilters = [...filtersSet];

      return updatedAppliedFilters;
    });
  };

  const updateSegregatedFiltersBasedOn = (updatedAppliedFilters: string[]) => {
    const newSegregatedFilters: Record<string, string[]> = {
      Zoning: [],
      Legal: [],
      Development: [],
      Topgraphy: [],
      Environment: [],
    };

    updatedAppliedFilters.forEach((filter) => {
      for (let filterType of filters) {
        if (filterType.labels.some((label) => label.name === filter)) {
          if (!newSegregatedFilters[filterType.title].includes(filter)) {
            newSegregatedFilters[filterType.title].push(filter);
          }
          break;
        }
      }
    });

    setSegregatedFilters(newSegregatedFilters);
  };

  const handleClearAll = () => {
    setAppliedFilters([]);
  };

  const filteredListings = listings?.filter((listing) => {
    return Object.keys(segregatedFilters).every((key) => {
      if (segregatedFilters[key].length === 0) return true;
      return segregatedFilters[key].some(
        (filter) => listing?.labels?.includes(filter)
      );
    });
  });

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
                  onClick={handleLabelClick}
                />
              </Box>
            ))}
            <Box sx={styles.gitHubPseudo}>
              <WillowButton_Browse onClick={handleClearAll}>
                Clear All
              </WillowButton_Browse>
            </Box>
          </Box>
        </FilterBox>
        <CardBox open={filtersOpen}>
          {isLoading ? (
            <Box sx={styles.loadingBox}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={styles.cards}>
              {filteredListings &&
                filteredListings.map((listing, index) => (
                  <Card key={index} listing={listing} />
                ))}
            </Box>
          )}
        </CardBox>
      </Box>
    </Box>
  );
};

export default Browse;
