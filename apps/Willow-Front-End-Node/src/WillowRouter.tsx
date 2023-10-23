import { Box } from "@mui/material";
import Home from "./Pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import Browse from "./Pages/Browse";
import Help from "./Pages/Help";

function WillowRouter() {
  return (
    <Box sx={{ height: "100vh", overflow: "hidden" }}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Box>
  );
}

export default WillowRouter;
