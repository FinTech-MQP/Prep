import { SetStateAction, useContext, useEffect, useState } from "react";
import GitHubLabel from "../components/GitHubLabel";
import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { SECONDARY_COLOR, WILLOW_COLOR } from "@monorepo/utils";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { userContext } from "../App";
import { LabelType } from "@monorepo/utils";
import { ListingPayload } from "database";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import Inspect from "../components/Inspect";
import ListingConsumer from "../services/ListingConsumer";
import { Zone } from "database/generated/prisma-client";
import { Range } from "react-range";

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
    margin: "0 20px 40px 20px",
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

const Track = styled(Box)`
  height: 6px;
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
`;

const Thumb = styled(Box)`
  height: 20px;
  width: 20px;
  background-color: #999;
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

interface FilterType {
  title: string;
  desc: string;
  labels: LabelType[];
}

const Browse = () => {
  const user = useContext(userContext);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [listings, setListings] = useState<ListingPayload[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zones, setZones] = useState<LabelType[]>([]);
  const [filter, setFilter] = useState<FilterType>({
    title: "",
    desc: "",
    labels: [],
  });
  const [acreValues, setAcreValues] = useState<number[]>([0, 20]);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<ListingPayload[]>();

  useEffect(() => {
    setIsLoading(true);
    ListingConsumer.getZones().then((result: Zone[] | undefined) => {
      const zoneTemp: LabelType[] = result
        ? result.map((item: Zone) => ({
            name: item.id,
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`,
            description: item.zoneDesc,
          }))
        : [];

      setZones(zoneTemp);
    });
    ListingConsumer.getListings().then(
      (result: SetStateAction<ListingPayload[] | undefined>) => {
        setListings(result);
        setFilteredListings(result);
        setIsLoading(false);
      }
    );
  }, []);

  const toggleFilter = () => setFiltersOpen(!filtersOpen);
  const inspectClose = () => user.setInsecting(false);

  useEffect(() => {
    setFilter({
      title: "Zones",
      desc: "Filter by zones",
      labels: zones,
    });
  }, [zones]);

  const handleLabelClick = (selectedLabels: LabelType[]) => {
    setAppliedFilters(selectedLabels.map((label) => label.name));
  };

  const handleClearAll = () => {
    setAcreValues([0, 20]);
    setAppliedFilters([]);
  };

  useEffect(() => {
    let filtered: ListingPayload[] = [];
    listings?.filter((listing) => {
      const isWithinSqftBounds =
        listing.address.parcel.sqft >= acreValues[0] &&
        (acreValues[1] === 20 || listing.address.parcel.sqft <= acreValues[1]);

      const matchesFilter =
        appliedFilters.length === 0 ||
        appliedFilters.some((filter) =>
          listing.address.parcel.zone.id.includes(filter)
        );

      if (isWithinSqftBounds && matchesFilter)
        filtered = [...filtered, listing];
    });

    setFilteredListings(filtered);
  }, [appliedFilters, acreValues]);

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
            {isLoading ? (
              <Box sx={styles.loadingBox}>
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={styles.gitHubPseudo}>
                  <Box sx={styles.gitHubPseudo}>
                    <Typography>
                      <span style={{ fontWeight: 700 }}>Parcel Size:</span>{" "}
                      {acreValues[0]} - {acreValues[1]}
                      {acreValues[1] === 20 && "+"} acres
                    </Typography>
                    <Range
                      step={1}
                      min={0}
                      max={20}
                      values={acreValues}
                      onChange={(values: number[]) =>
                        setAcreValues([values[0], values[1]])
                      }
                      renderTrack={({ props, children }) => {
                        const percentageLeft = (acreValues[0] / 20) * 100;
                        const percentageRight = (acreValues[1] / 20) * 100;
                        return (
                          <Track
                            {...props}
                            style={{
                              ...props.style,
                              height: "6px",
                              background: `linear-gradient(to right, #ccc ${percentageLeft}%, ${WILLOW_COLOR} ${percentageLeft}%, ${WILLOW_COLOR} ${percentageRight}%, #ccc ${percentageRight}%)`,
                              width: "100%",
                            }}
                          >
                            {children}
                          </Track>
                        );
                      }}
                      renderThumb={({ props }) => (
                        <Thumb
                          {...props}
                          style={{
                            ...props.style,
                            height: "12px",
                            width: "12px",
                            borderRadius: "50%",
                            border: "2px solid black",
                            backgroundColor: "white",
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={styles.gitHubPseudo}>
                    <GitHubLabel
                      title={filter.title}
                      desc={filter.desc}
                      labels={filter.labels}
                      onClick={handleLabelClick}
                    />
                  </Box>
                </Box>
                <Box sx={styles.gitHubPseudo}>
                  <WillowButton_Browse onClick={handleClearAll}>
                    Clear All
                  </WillowButton_Browse>
                </Box>
              </Box>
            )}
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
