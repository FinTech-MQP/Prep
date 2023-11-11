import styled from "@emotion/styled";
import { WILLOW_COLOR, WILLOW_COLOR_HOVER } from "@monorepo/utils";
import { Box, Button } from "@mui/material";
import OpenAI_API from "../services/APIConsumer";

const WillowButton = styled(Button)({
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

const apiCall = () => {
  console.log("call");
  OpenAI_API.testAPI("Hello");
};

const Pertmitting = () => {
  return (
    <Box>
      <WillowButton onClick={apiCall}>Analyze</WillowButton>
    </Box>
  );
};

export default Pertmitting;
