import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useContext,
  useEffect,
  useState,
} from "react";
import { userContext } from "../App";
import { SECONDARY_COLOR, WILLOW_COLOR, programs } from "@monorepo/utils";
import { Box, Typography, Divider, Tooltip } from "@mui/material";
import { WillowButton_Browse } from "../Pages/Browse";
import ImageGrid from "./ImageGrid";
import styled from "@emotion/styled";
import { ProgramCriteria } from "@monorepo/utils/interfaces";
import { Range } from "react-range";
import { TypographyProps } from "@mui/material/Typography";
import { BookmarkButton } from "./BookmarkButton";
import { Page } from "./Page";
import InfoIcon from "@mui/icons-material/Info";
import Permitting from "./Permitting";
import ChatBox from "./ChatBox";

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
    height: "92%",
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
    top: "25px",
  },
  inspectContent: {
    width: "100%",
    height: "calc(100% - 40px)",
    margin: "60px 0 0 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 40px 0 40px",
    boxSizing: "border-box",
  },
  inspectContentPseudo: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  inspectContentContainer: {
    width: "50%",
    height: "100%",
  },
  info: {
    height: "100%",
    overflow: "hidden",
    padding: "0 0 0 40px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
    padding: "10px 0 0 0",
    boxSizing: "border-box",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
  },
  pageContainer: {
    position: "relative",
    width: "100%",
    height: "calc(100% - 40px)",
  },
  tooltipContainer: {
    display: "flex",
    justifyContent: "center",
    width: "fit-content",
  },
};

interface InspectProps {
  close: () => void;
}

const Container = styled.div`
  width: 95%;
  box-sizing: border-box;
  margin: 10px 0 10px 0;
`;

const RangeContainer = styled.div`
  margin: 10px 0 20px;
  padding: 0 10px 0 10px;
  box-sizing: border-box;
`;

const Track = styled.div`
  height: 6px;
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
`;

const Thumb = styled.div`
  height: 20px;
  width: 20px;
  background-color: #999;
`;

const ProgramContainer = styled.div`
  margin-top: 20px;
  box-sizing: border-box;
`;

const ProgramInfo = styled.div<ProgramTypographyProps>`
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.applicable === "true" ? WILLOW_COLOR : "#ccc"};
  color: black;
  box-sizing: border-box;
  height: 120px;
  transition: background-color 0.3s ease;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${WILLOW_COLOR};
    border-radius: 20px;
    border: none;
  }
`;

interface ProgramTypographyProps extends TypographyProps {
  applicable: string;
}

const ProgramTypography = styled(Typography)<ProgramTypographyProps>`
  color: ${(props) => (props.applicable === "true" ? "white" : "black")};
  transition: color 0.3s ease;
`;

const evaluateCriteria = (
  programCriteria: ProgramCriteria,
  userCriteria: {
    amiRange: [number, number];
    adaRange: [number, number];
    mixedIncome: boolean;
    affordabilityTerm: [number, number];
    unhoused?: boolean;
    firstTimeHomebuyers?: string;
    constructionStartDate?: string;
    dateOfOccupancyRequired?: string;
  }
) => {
  const explanations: string[] = [];

  // Check AMI range
  if (
    !(programCriteria.amiRange[0] === 0 && programCriteria.amiRange[1] === 0) &&
    (userCriteria.amiRange[0] < programCriteria.amiRange[0] ||
      userCriteria.amiRange[1] > programCriteria.amiRange[1])
  ) {
    explanations.push(
      `AMI range (${userCriteria.amiRange.join(
        "-"
      )}%) is outside the program criteria (${programCriteria.amiRange.join(
        "-"
      )}%)`
    );
  }

  // Check ADA range
  if (
    !(programCriteria.adaRange[0] === 0 && programCriteria.adaRange[1] === 0) &&
    (userCriteria.adaRange[0] < programCriteria.adaRange[0] ||
      userCriteria.adaRange[1] > programCriteria.adaRange[1])
  ) {
    explanations.push(
      `ADA range (${userCriteria.adaRange.join(
        "-"
      )}%) is outside the program criteria (${programCriteria.adaRange.join(
        "-"
      )}%)`
    );
  }

  // Check mixed income requirement
  if (programCriteria.mixedIncome && !userCriteria.mixedIncome) {
    explanations.push(
      "Program requires mixed income and the property is not mixed income"
    );
  }

  console.log();

  // Check affordability term
  if (
    !(
      programCriteria.affordabilityTerm[0] === 0 &&
      programCriteria.affordabilityTerm[1] === 0
    ) &&
    (userCriteria.affordabilityTerm[0] < programCriteria.affordabilityTerm[0] ||
      userCriteria.affordabilityTerm[1] > programCriteria.affordabilityTerm[1])
  ) {
    explanations.push(
      `Affordability term range (${userCriteria.affordabilityTerm.join(
        "-"
      )}%) is outside the program criteria (${programCriteria.affordabilityTerm.join(
        "-"
      )}%)`
    );
  }

  // Check unhoused requirement
  if (
    programCriteria.unhoused !== undefined &&
    programCriteria.unhoused !== userCriteria.unhoused
  ) {
    explanations.push(
      `Program ${
        programCriteria.unhoused ? "is" : "is not"
      } specific to unhoused individuals, which does not match your criteria.`
    );
  }

  // Check first-time homebuyer requirement
  if (
    programCriteria.firstTimeHomebuyers &&
    !userCriteria.firstTimeHomebuyers
  ) {
    explanations.push(
      "Program is specifically for first-time homebuyers, which does not match your criteria."
    );
  }

  if (
    programCriteria.constructionStartDate &&
    userCriteria.constructionStartDate &&
    new Date(userCriteria.constructionStartDate) <
      new Date(programCriteria.constructionStartDate)
  ) {
    explanations.push(
      `Construction start date (${userCriteria.constructionStartDate}) is earlier than the program requirement (${programCriteria.constructionStartDate})`
    );
  }

  // Check for date of occupancy
  if (
    programCriteria.dateOfOccupancyRequired &&
    userCriteria.dateOfOccupancyRequired &&
    new Date(userCriteria.dateOfOccupancyRequired) <
      new Date(programCriteria.dateOfOccupancyRequired)
  ) {
    explanations.push(
      `Date of occupancy (${userCriteria.dateOfOccupancyRequired}) is earlier than the program requirement (${programCriteria.dateOfOccupancyRequired})`
    );
  }

  return {
    match: explanations.length === 0,
    explanation: explanations.join(". ") || "Applicable",
  };
};

const Inspect = ({ close }: InspectProps) => {
  const user = useContext(userContext);
  const [activePage, setActivePage] = useState<number>(1);
  const [amiValues, setAmiValues] = useState<[number, number]>([0, 120]);
  const [adaValues, setAdaValues] = useState<[number, number]>([0, 100]);
  const [isMixedIncome, setIsMixedIncome] = useState<boolean>(false);
  const [affordabilityTermValues, setAffordabilityTermValues] = useState<
    [number, number]
  >([0, 40]);
  const [isUnHoused, setIsUnHoused] = useState<boolean>(false);
  const [firstTime, setFirstTime] = useState<string>("No");
  const [buildingCommencement, setBuildingCommencement] = useState<string>("");
  const [occupancyDate, setOccupancyDate] = useState<string>("");
  const today = new Date().toISOString().split("T")[0];

  const handleBookmarkClick = (pageIndex: number) => {
    setActivePage(pageIndex);
  };

  return (
    <Box sx={styles.inspectPseudo}>
      <Box sx={styles.inspect}>
        <WillowButton_Browse sx={styles.inspectClose} onClick={close}>
          Return to Browsing
        </WillowButton_Browse>
        <Box sx={styles.inspectContent}>
          <Box sx={styles.buttonContainer}>
            <BookmarkButton
              label="Info"
              onClick={() => handleBookmarkClick(1)}
              clicked={activePage === 1}
            />
            <BookmarkButton
              label="Financial Program Eligibility"
              onClick={() => handleBookmarkClick(2)}
              clicked={activePage === 2}
            />
            <BookmarkButton
              label="Permitting"
              onClick={() => handleBookmarkClick(3)}
              clicked={activePage === 3}
            />
          </Box>
          <Box sx={styles.inspectContentPseudo}>
            <Box sx={styles.inspectContentContainer}>
              <Box sx={styles.pageContainer}>
                <Page isOpen={activePage === 1} left={true}>
                  <Box sx={styles.imagesContainer}>
                    <ImageGrid
                      images={user.currListing && user.currListing.images}
                    />
                  </Box>
                </Page>
                <Page isOpen={activePage === 2} left={true}>
                  <ProgramContainer>
                    <Typography variant="h5" fontWeight={700}>
                      ALL PROGRAMS
                    </Typography>
                    {programs.map((program, index) => {
                      const { match, explanation } = evaluateCriteria(
                        program.criteria,
                        {
                          amiRange: amiValues,
                          adaRange: adaValues,
                          unhoused: isUnHoused,
                          firstTimeHomebuyers: firstTime,
                          mixedIncome: isMixedIncome,
                          affordabilityTerm: affordabilityTermValues,
                          constructionStartDate: buildingCommencement,
                          dateOfOccupancyRequired: occupancyDate,
                        }
                      );

                      return (
                        <ProgramInfo key={index} applicable={match.toString()}>
                          <ProgramTypography
                            fontWeight={700}
                            applicable={match.toString()}
                          >
                            {program.name}
                          </ProgramTypography>
                          <ProgramTypography applicable={match.toString()}>
                            {explanation}
                          </ProgramTypography>
                        </ProgramInfo>
                      );
                    })}
                  </ProgramContainer>
                </Page>
                <Page isOpen={activePage === 3} left={true}>
                  <Permitting />
                </Page>
              </Box>
            </Box>
            <Box sx={styles.inspectContentContainer}>
              {user.currListing && (
                <Box sx={styles.info}>
                  <Box sx={styles.pageContainer}>
                    <Page isOpen={activePage === 1} left={false}>
                      <Box>
                        <Typography sx={styles.title}>
                          {user.currListing.name
                            .toLowerCase()
                            .replace(/\b(\w)/g, (s) => s.toUpperCase())}
                        </Typography>
                        <Typography sx={styles.subtitle}>
                          {user.currListing.address.parcel.zoneId.toString()}{" "}
                          {" | "}
                          {user.currListing.address.parcelId.toString()}
                          {" | "}
                          {user.currListing.address.parcel.acres
                            .toFixed(2)
                            .toLocaleString()}
                          {" acres"}
                        </Typography>
                        <Box sx={styles.labelContainer}>
                          {user.currListing.labels &&
                            user.currListing.labels.map(
                              (
                                label:
                                  | string
                                  | number
                                  | boolean
                                  | ReactElement<
                                      any,
                                      string | JSXElementConstructor<any>
                                    >
                                  | Iterable<ReactNode>
                                  | ReactPortal
                                  | null
                                  | undefined,
                                index: Key | null | undefined
                              ) => (
                                <Typography key={index} sx={styles.label}>
                                  {label}
                                </Typography>
                              )
                            )}
                        </Box>
                        <Divider sx={styles.divider} />
                        <Typography sx={styles.desc}>
                          {user.currListing.desc}
                        </Typography>
                      </Box>
                    </Page>
                    <Page isOpen={activePage === 2} left={false}>
                      <Container>
                        {/* AMI Range slider */}

                        <Typography
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "fit-content",
                          }}
                        >
                          <Tooltip
                            title="AMI, or Area Median Income, represents the median income in a specific area. When developers build affordable housing to a percentage of AMI, they set rents or sale prices to accommodate individuals or families earning a certain percentage of the local median income, making housing more accessible."
                            placement="left"
                            arrow
                            enterDelay={500}
                            leaveDelay={200}
                            sx={{
                              marginRight: "4px",
                            }}
                          >
                            <InfoIcon />
                          </Tooltip>
                          Area Median Income (AMI): {amiValues[0]}% -{" "}
                          {amiValues[1]}%
                        </Typography>
                        <RangeContainer>
                          <Range
                            step={1}
                            min={0}
                            max={120}
                            values={amiValues}
                            onChange={(values: number[]) =>
                              setAmiValues([values[0], values[1]])
                            }
                            renderTrack={({ props, children }) => {
                              const percentageLeft = (amiValues[0] / 120) * 100;
                              const percentageRight =
                                (amiValues[1] / 120) * 100;
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
                        </RangeContainer>

                        {/* ADA Range slider */}
                        <Typography
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "fit-content",
                          }}
                        >
                          <Tooltip
                            title="ADA stands for the Americans with Disabilities Act. When developers build a percentage of units as ADA-compliant, those units are designed to meet accessibility standards outlined in the ADA, ensuring they accommodate individuals with disabilities promoting inclusivity and equal access to housing."
                            placement="left"
                            arrow
                            enterDelay={500}
                            leaveDelay={200}
                            sx={{ marginRight: "4px" }}
                          >
                            <InfoIcon />
                          </Tooltip>
                          Americans with Disability Act (ADA): {adaValues[0]}% -{" "}
                          {adaValues[1]}%
                        </Typography>
                        <RangeContainer>
                          <Range
                            step={1}
                            min={0}
                            max={100}
                            values={adaValues}
                            onChange={(values: number[]) =>
                              setAdaValues([values[0], values[1]])
                            }
                            renderTrack={({ props, children }) => {
                              const percentageLeft = (adaValues[0] / 100) * 100;
                              const percentageRight =
                                (adaValues[1] / 100) * 100;
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
                        </RangeContainer>
                        <fieldset>
                          <legend
                            style={{
                              fontFamily:
                                '"Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "fit-content",
                              }}
                            >
                              <Tooltip
                                title="More information"
                                placement="left"
                                arrow
                                enterDelay={500}
                                leaveDelay={200}
                                sx={{ marginRight: "4px" }}
                              >
                                <InfoIcon />
                              </Tooltip>
                              Is the property intended for unhoused residents?
                            </Typography>
                          </legend>
                          <Typography
                            sx={{ cursor: "pointer" }}
                            onClick={() => setIsUnHoused(true)}
                          >
                            <input
                              type="radio"
                              name="unHoused"
                              value="yes"
                              checked={isUnHoused}
                              onChange={() => setIsUnHoused(true)}
                            />
                            <span style={{ userSelect: "none" }}>Yes</span>
                          </Typography>
                          <Typography
                            sx={{ cursor: "pointer" }}
                            onClick={() => setIsUnHoused(false)}
                          >
                            <input
                              type="radio"
                              name="unHoused"
                              value="no"
                              checked={!isUnHoused}
                              onChange={() => setIsUnHoused(false)}
                            />
                            <span style={{ userSelect: "none" }}>No</span>
                          </Typography>
                        </fieldset>
                        <br />
                        <fieldset>
                          <legend
                            style={{
                              fontFamily:
                                '"Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "fit-content",
                              }}
                            >
                              <Tooltip
                                title="More information"
                                placement="left"
                                arrow
                                enterDelay={500}
                                leaveDelay={200}
                                sx={{ marginRight: "4px" }}
                              >
                                <InfoIcon />
                              </Tooltip>
                              Is the property targeted towards first-time
                              homebuyers?
                            </Typography>
                          </legend>
                          <Typography
                            sx={{ cursor: "pointer" }}
                            onClick={() => setFirstTime("Yes")}
                          >
                            <input
                              type="radio"
                              name="firstTime"
                              value="yes"
                              checked={firstTime === "Yes"}
                              onChange={() => setFirstTime("Yes")}
                            />
                            <span style={{ userSelect: "none" }}>Yes</span>
                          </Typography>
                          <Typography
                            sx={{ cursor: "pointer" }}
                            onClick={() => setFirstTime("Some")}
                          >
                            <input
                              type="radio"
                              name="firstTime"
                              value="Some"
                              checked={firstTime === "Some"}
                              onChange={() => setFirstTime("Some")}
                            />
                            <span style={{ userSelect: "none" }}>Some</span>
                          </Typography>
                          <Typography
                            sx={{ cursor: "pointer" }}
                            onClick={() => setFirstTime("No")}
                          >
                            <input
                              type="radio"
                              name="firstTime"
                              value="no"
                              checked={firstTime === "No"}
                              onChange={() => setFirstTime("No")}
                            />
                            <span style={{ userSelect: "none" }}>No</span>
                          </Typography>
                        </fieldset>
                        <br />
                        {/* Mixed Income Radio Buttons */}
                        <fieldset>
                          <legend
                            style={{
                              fontFamily:
                                '"Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "fit-content",
                              }}
                            >
                              <Tooltip
                                title="Mixed-income housing integrates residences for various income levels within the same community, fostering socio-economic diversity. This approach aims to create inclusive neighborhoods by offering affordable units alongside market-rate housing, promoting economic integration, and reducing concentrations of poverty."
                                placement="left"
                                arrow
                                enterDelay={500}
                                leaveDelay={200}
                                sx={{ marginRight: "4px" }}
                              >
                                <InfoIcon />
                              </Tooltip>
                              Is your property mixed income?
                            </Typography>
                          </legend>
                          <Typography
                            sx={{ cursor: "pointer" }}
                            onClick={() => setIsMixedIncome(true)}
                          >
                            <input
                              type="radio"
                              name="mixedIncome"
                              value="yes"
                              checked={isMixedIncome}
                              onChange={() => setIsMixedIncome(true)}
                            />
                            <span style={{ userSelect: "none" }}>Yes</span>
                          </Typography>
                          <Typography
                            sx={{ cursor: "pointer" }}
                            onClick={() => setIsMixedIncome(false)}
                          >
                            <input
                              type="radio"
                              name="mixedIncome"
                              value="no"
                              checked={!isMixedIncome}
                              onChange={() => setIsMixedIncome(false)}
                            />
                            <span style={{ userSelect: "none" }}>No</span>
                          </Typography>
                        </fieldset>
                        <br />
                        {/* Affordability Term Slider */}

                        <Typography sx={styles.tooltipContainer}>
                          <Tooltip
                            title={`"Term of Affordability" in affordable housing development denotes the duration during which housing units remain priced below market rates. Developers may commit to keeping these units affordable for a specified period, ensuring long-term affordability for low to moderate-income residents before potential reevaluation or market adjustments.`}
                            placement="left"
                            arrow
                            enterDelay={500}
                            leaveDelay={200}
                            sx={{ marginRight: "4px" }}
                          >
                            <InfoIcon />
                          </Tooltip>
                          Term of Affordability:{" "}
                          {affordabilityTermValues[0] +
                            " - " +
                            affordabilityTermValues[1]}{" "}
                          Years
                        </Typography>
                        <RangeContainer>
                          <Range
                            step={1}
                            min={0}
                            max={40}
                            values={affordabilityTermValues}
                            onChange={(values: number[]) =>
                              setAffordabilityTermValues([values[0], values[1]])
                            }
                            renderTrack={({ props, children }) => {
                              const percentageLeft =
                                (affordabilityTermValues[0] / 40) * 100;
                              const percentageRight =
                                (affordabilityTermValues[1] / 40) * 100;
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
                        </RangeContainer>

                        <br />
                        {/* Building Commencement Date Picker */}
                        <Typography component="div">
                          <Typography sx={styles.tooltipContainer}>
                            <Tooltip
                              title="More information"
                              placement="left"
                              arrow
                              enterDelay={500}
                              leaveDelay={200}
                              sx={{ marginRight: "4px" }}
                            >
                              <InfoIcon />
                            </Tooltip>
                            Expected Date of Building Commencement:
                          </Typography>

                          <input
                            style={{ marginTop: "10px" }}
                            type="date"
                            value={buildingCommencement}
                            min={today}
                            onChange={(e) =>
                              setBuildingCommencement(e.target.value)
                            }
                          />
                        </Typography>
                        {/* Occupancy Date Picker */}
                        <Typography sx={{ marginTop: "10px" }} component="div">
                          <Typography sx={styles.tooltipContainer}>
                            <Tooltip
                              title="More information"
                              placement="left"
                              arrow
                              enterDelay={500}
                              leaveDelay={200}
                              sx={{ marginRight: "4px" }}
                            >
                              <InfoIcon />
                            </Tooltip>
                            Expected Date of Occupancy:
                          </Typography>
                          <input
                            style={{ marginTop: "10px" }}
                            type="date"
                            value={occupancyDate}
                            min={today}
                            onChange={(e) => setOccupancyDate(e.target.value)}
                          />
                        </Typography>

                        {/* Display all programs with color coding and explanations */}
                      </Container>
                    </Page>
                    <Page isOpen={activePage === 3} left={false}>
                      <ChatBox currentPage={activePage === 3} />
                    </Page>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Inspect;
