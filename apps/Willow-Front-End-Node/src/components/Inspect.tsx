import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useContext,
  useState,
} from "react";
import { userContext } from "../App";
import {
  SECONDARY_COLOR,
  WILLOW_COLOR,
  WILLOW_COLOR_HOVER,
  programs,
} from "@monorepo/utils";
import { Box, Typography, Divider, Button, TextField } from "@mui/material";
import { WillowButton_Browse } from "../Pages/Browse";
import ImageGrid from "./ImageGrid";
import styled from "@emotion/styled";
import InterestConsumer from "../services/InterestConsumer";
import { ProgramCriteria } from "@monorepo/utils/interfaces";
import { Range } from "react-range";
import SoloSlider from "./SoloSlider";
import { TypographyProps } from "@mui/material/Typography";
import { BookmarkButton } from "./BookmarkButton";
import { Page } from "./Page";
import Pertmitting from "./Permitting";

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
    padding: "0 0 40px 40px",
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
    padding: "10px 0 10px 0",
    boxSizing: "border-box",
  },
  interestContainer: {
    display: "flex",
    flexDirection: "column",
  },
  interestText: {
    width: "100%",
  },
  emailError: {
    color: "red",
    margin: "0 0 6px 0",
  },
  emailBox: {
    display: "flex",
    flexDirection: "row",
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
    height: "calc(100% - 31px)",
  },
};

interface InspectProps {
  close: () => void;
}

const WillowButton_Interest = styled(Button)({
  borderRadius: 0,
  backgroundColor: WILLOW_COLOR,
  color: "white",
  whiteSpace: "nowrap",
  width: "fit-content",
  padding: "0 25px 0 25px",
  "&:hover": {
    backgroundColor: WILLOW_COLOR_HOVER,
    borderColor: WILLOW_COLOR,
  },
  "& .MuiTouchRipple-root": {
    color: "white",
  },
});

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
    props.applicable === "true" ? "#30cd95" : "#cd3030"};
  color: black;
  box-sizing: border-box;
  height: 120px;
  transition: background-color 0.3s ease;
`;

interface ProgramTypographyProps extends TypographyProps {
  applicable: string;
}

const ProgramTypography = styled(Typography)<ProgramTypographyProps>`
  color: ${(props) => (props.applicable === "true" ? "black" : "white")};
  transition: color 0.3s ease;
`;

const evaluateCriteria = (
  programCriteria: ProgramCriteria,
  userCriteria: {
    amiRange: any;
    adaRange: any;
    mixedIncome: any;
    affordabilityTerm: any;
    unhoused?: any;
    marketRate?: any;
  }
) => {
  const explanations = [];

  // Check each criterion and add to explanations if there's a mismatch
  if (
    userCriteria.amiRange[0] < programCriteria.amiRange[0] ||
    userCriteria.amiRange[1] > programCriteria.amiRange[1]
  ) {
    explanations.push(
      `AMI range (${userCriteria.amiRange.join(
        "-"
      )}%) is outside the program criteria (${programCriteria.amiRange.join(
        "-"
      )}%)`
    );
  }
  if (
    userCriteria.adaRange[0] < programCriteria.adaRange[0] ||
    userCriteria.adaRange[1] > programCriteria.adaRange[1]
  ) {
    explanations.push(
      `ADA range (${userCriteria.adaRange.join(
        "-"
      )}%) is outside the program criteria (${programCriteria.adaRange.join(
        "-"
      )}%)`
    );
  }
  if (programCriteria.mixedIncome && !userCriteria.mixedIncome) {
    explanations.push(
      "Program requires mixed income and the property is not mixed income"
    );
  }
  if (userCriteria.affordabilityTerm < programCriteria.affordabilityTerm) {
    explanations.push(
      `Affordability term (${userCriteria.affordabilityTerm} years) is less than required (${programCriteria.affordabilityTerm} years minimum)`
    );
  }
  if (
    programCriteria.priorityAmi &&
    userCriteria.amiRange[1] > programCriteria.priorityAmi
  ) {
    explanations.push(
      `Priority is given to those with AMI under ${programCriteria.priorityAmi}%, your upper range is ${userCriteria.amiRange[1]}%`
    );
  }
  if (
    programCriteria.unhoused !== undefined &&
    programCriteria.unhoused !== userCriteria.unhoused
  ) {
    explanations.push(
      "Program is specific to unhoused individuals, which does not match your criteria"
    );
  }
  if (
    programCriteria.marketRate !== undefined &&
    userCriteria.marketRate !== programCriteria.marketRate
  ) {
    explanations.push(
      `Program is for ${
        programCriteria.marketRate ? "market rate" : "non-market rate"
      } developments which does not match your criteria`
    );
  }
  return {
    match: explanations.length === 0,
    explanation: explanations.join(". ") || "Applicable",
  };
};

const Inspect = ({ close }: InspectProps) => {
  const user = useContext(userContext);
  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<number>(1);
  const [amiValues, setAmiValues] = useState<[number, number]>([0, 120]);
  const [adaValues, setAdaValues] = useState<[number, number]>([0, 100]);
  const [isMixedIncome, setIsMixedIncome] = useState<boolean>(false);
  const [affordabilityTerm, setAffordabilityTerm] = useState<number>(0);
  const [buildingCommencement, setBuildingCommencement] = useState<string>("");
  const [occupancyDate, setOccupancyDate] = useState<string>("");
  const today = new Date().toISOString().split("T")[0];

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  function isValidEmail(email: string) {
    const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  const handleSubmit = () => {
    if (email.length > 0 && isValidEmail(email) && user.currListing) {
      setValidEmail(true);
      InterestConsumer.expressInterest(email, user.currListing);
    } else {
      setValidEmail(false);
    }
  };

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
                          mixedIncome: isMixedIncome,
                          affordabilityTerm,
                          // Add other criteria as necessary
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
                  <></>
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
                          {user.currListing.address.parcelId.toString()} {" | "}
                          {user.currListing.address.parcel.zoneId.toString()}
                          {" | "}
                          {user.currListing.address.parcel.sqft.toLocaleString()}
                          {" sqft"}
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
                        <Typography>
                          AMI Range: {amiValues[0]}% - {amiValues[1]}%
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
                        <Typography>
                          ADA Range: {adaValues[0]}% - {adaValues[1]}%
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

                        {/* Mixed Income Radio Buttons */}
                        <fieldset>
                          <legend
                            style={{
                              fontFamily:
                                '"Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            Is your property mixed income?
                          </legend>
                          <Typography>
                            <input
                              type="radio"
                              name="mixedIncome"
                              value="yes"
                              checked={isMixedIncome}
                              onChange={() => setIsMixedIncome(true)}
                            />
                            Yes
                          </Typography>
                          <Typography>
                            <input
                              type="radio"
                              name="mixedIncome"
                              value="no"
                              checked={!isMixedIncome}
                              onChange={() => setIsMixedIncome(false)}
                            />
                            No
                          </Typography>
                        </fieldset>

                        {/* Affordability Term Slider */}
                        <Typography sx={{ marginTop: "20px" }} component="div">
                          Term of Affordability: {affordabilityTerm} Years
                          <SoloSlider
                            min={0}
                            max={100}
                            step={1}
                            initialValue={0}
                            onChange={(value: any) =>
                              setAffordabilityTerm(Number(value))
                            }
                            fillColor={WILLOW_COLOR}
                          />
                        </Typography>

                        {/* Building Commencement Date Picker */}
                        <Typography sx={{ marginTop: "10px" }}>
                          Expected Date of Building Commencement:
                          <br />
                          <input
                            type="date"
                            value={buildingCommencement}
                            min={today}
                            onChange={(e) =>
                              setBuildingCommencement(e.target.value)
                            }
                            style={{ marginTop: "4px" }}
                          />
                        </Typography>

                        {/* Occupancy Date Picker */}
                        <Typography sx={{ marginTop: "10px" }}>
                          Expected Date of Occupancy:
                          <br />
                          <input
                            type="date"
                            value={occupancyDate}
                            min={today}
                            onChange={(e) => setOccupancyDate(e.target.value)}
                            style={{ marginTop: "4px" }}
                          />
                        </Typography>

                        {/* Display all programs with color coding and explanations */}
                      </Container>
                    </Page>
                    <Page isOpen={activePage === 3} left={false}>
                      <Pertmitting />
                    </Page>
                  </Box>

                  <Box sx={styles.interestContainer}>
                    {!validEmail && (
                      <Typography sx={styles.emailError}>
                        Please enter a valid email.
                      </Typography>
                    )}

                    <Box sx={styles.emailBox}>
                      <TextField
                        variant="outlined"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        sx={styles.interestText}
                      />
                      <WillowButton_Interest onClick={handleSubmit}>
                        Stay Updated
                      </WillowButton_Interest>
                    </Box>
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
