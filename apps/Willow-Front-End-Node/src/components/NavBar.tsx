import { Box, Button, Typography } from "@mui/material";
import WILLOW_LOGO from "../assets/Willow Logo.png";
import {
  DARK_GREY_COLOR,
  SECONDARY_COLOR,
  WILLOW_COLOR,
} from "../utils/constants";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const styles = {
  navBarContainer: {
    top: 0,
    width: "100%",
    height: "100px",
    backgroundColor: SECONDARY_COLOR,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    padding: "0 80px 0 80px",
  },
  center: {
    margin: "0 10% 0 10%",
  },
  side: {
    height: "100%",
    width: "120px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  homeButtom: {
    width: "260px !important",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "10px 20px 10px 20px",
  },
  title: {
    color: WILLOW_COLOR,
    fontSize: "50px",
    fontWeight: 800,
    letterSpacing: "-2px",
    textTransform: "none",
  },
  text: {
    color: DARK_GREY_COLOR,
    fontSize: "30px",
    fontWeight: 400,
    letterSpacing: "-2px",
    textTransform: "none",
  },
  img: {
    width: "auto",
    height: "40px",
  },
};

const WillowButton_Nav = styled(Button)({
  width: "110px",
  height: "100%",
  borderRadius: "0px",
  "&:hover": {
    backgroundColor: "white",
  },
  "& .MuiTouchRipple-root": {
    color: WILLOW_COLOR,
  },
});

const NavBar = () => {
  const navigate = useNavigate();

  const homeButtomClick = () => {
    navigate("/home");
  };

  const browseButtomClick = () => {
    navigate("/browse");
  };

  const helpButtomClick = () => {
    navigate("/help");
  };

  return (
    <Box sx={styles.navBarContainer}>
      <Box sx={styles.side}>
        <WillowButton_Nav onClick={browseButtomClick}>
          <Typography sx={styles.text}>Browse</Typography>
        </WillowButton_Nav>
      </Box>
      <Box sx={styles.center}>
        <WillowButton_Nav
          sx={styles.homeButtom}
          onClick={homeButtomClick}
          color="primary"
        >
          <img style={styles.img} src={WILLOW_LOGO} />
          <Typography sx={styles.title}>Willow</Typography>
        </WillowButton_Nav>
      </Box>
      <Box sx={styles.side}>
        <WillowButton_Nav onClick={helpButtomClick}>
          <Typography sx={styles.text}>Help</Typography>
        </WillowButton_Nav>
      </Box>
    </Box>
  );
};

export default NavBar;
