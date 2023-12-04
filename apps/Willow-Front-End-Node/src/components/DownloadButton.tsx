import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import { userContext } from "../App.tsx";

const DownloadJsonButton = () => {
  const user = useContext(userContext);

  const jsonData = {
    example: user.currListing,
    timestamp: new Date().toISOString(),
  };

  const downloadJson = () => {
    const jsonString = JSON.stringify(jsonData);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${user.currListing?.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <IconButton
      onClick={downloadJson}
      color="primary"
      aria-label="download json"
      sx={{ width: "42px", height: "42px", margin: "0 4px 0 0" }}
    >
      <DownloadIcon sx={{ width: "42px", height: "42px" }} />
    </IconButton>
  );
};

export default DownloadJsonButton;
