import { ListingPayload } from "database";
import { Autocomplete, TextField } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../App";
import styled from "@emotion/styled";
import { SECONDARY_COLOR, WILLOW_COLOR } from "@monorepo/utils";

const styles = {
  search: {
    margin: "0 0 10vh 0",
    width: "60%",
  },
};

const SearchField = styled(TextField)({
  "& .MuiInputBase-root": {
    backgroundColor: SECONDARY_COLOR,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
  },
  '& label[data-shrink="true"]': {
    borderRadius: "5px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.4)",
    backgroundColor: SECONDARY_COLOR,
    color: WILLOW_COLOR,
    padding: "0 4px 0 4px",
    boxSizing: "border-box",
  },
  "& fieldset": {
    border: "none",
  },
  "& .MuiInputBase-root:hover": {
    border: "none",
  },
});

interface SearchBarProps {
  listings: ListingPayload[] | undefined;
}

const SearchBar = ({ listings }: SearchBarProps) => {
  const user = useContext(userContext);
  const navigate = useNavigate();

  const handleSearchAction = (value: any) => {
    if (value && (typeof value === "string" ? value.trim() !== "" : true)) {
      user.setCurrListing(value as ListingPayload);
      user.setInsecting(true);
      navigate("/browse");
    }
  };

  return (
    <Autocomplete
      freeSolo
      sx={styles.search}
      options={listings || []}
      getOptionLabel={(option: string | ListingPayload) =>
        typeof option === "string"
          ? option
          : option.address.parcelId + " | " + option.name
      }
      renderInput={(params) => (
        <SearchField
          {...params}
          label="Search"
          InputProps={{
            ...params.InputProps,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const inputValue = (e.target as HTMLInputElement).value;
              handleSearchAction(inputValue);
            }
          }}
        />
      )}
      onChange={(event, value) => handleSearchAction(value)}
    />
  );
};

export default SearchBar;
