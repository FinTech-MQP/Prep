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
} from "@monorepo/utils";
import { Box, Typography, Divider, Button, TextField } from "@mui/material";
import { WillowButton_Browse } from "../Pages/Browse";
import ImageGrid from "./ImageGrid";
import styled from "@emotion/styled";
import InterestConsumer from "../services/InterestConsumer";
import getAnswersAndExplanations from "../services/APIConsumer";
import Criteria from "./Criteria";
import { BookmarkButton } from "./BookmarkButton";
import { Page } from "./Page";

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
    overflow: "hidden",
    padding: "0 40px 40px 40px",
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
    padding: "10px 0 10px 40px",
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
    display: "flex",
    flexDirection: "row",
  },
  pageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
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

const Inspect = ({ close }: InspectProps) => {
  const user = useContext(userContext);
  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<number>(1);

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

  const handleAPICall = () => {
    //getAnswersAndExplanations(user.currListing);
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
          <Box sx={styles.inspectContentContainer}>
            <Box sx={styles.imagesContainer}>
              <ImageGrid images={user.currListing && user.currListing.images} />
            </Box>
          </Box>
          <Box sx={styles.inspectContentContainer}>
            {user.currListing && (
              <Box sx={styles.info}>
                <Box sx={styles.buttonContainer}>
                  <BookmarkButton
                    label="Info"
                    onClick={() => handleBookmarkClick(1)}
                    clicked={activePage === 1}
                  />
                  <BookmarkButton
                    label="Program Eligibility"
                    onClick={() => handleBookmarkClick(2)}
                    clicked={activePage === 2}
                  />
                  <BookmarkButton
                    label="Permitting"
                    onClick={() => handleBookmarkClick(3)}
                    clicked={activePage === 3}
                  />
                </Box>
                <Box sx={styles.pageContainer}>
                  <Page isOpen={activePage === 1}>
                    <Box>
                      <Typography sx={styles.title}>
                        {user.currListing.name}
                      </Typography>
                      <Typography sx={styles.subtitle}>
                        {/*user.currListing.parcelID} | {user.currListing.address*/}
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
                  <Page isOpen={activePage === 2}>
                    <Criteria />
                  </Page>
                  <Page isOpen={activePage === 3}>
                    <></>
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
  );
};

export default Inspect;
