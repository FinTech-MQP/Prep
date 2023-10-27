import express from "express";
import listingRouter from "./controllers/ListingController";

const app = express();
const PORT = process.env.PORT || 3001;

app.use("/Listing", listingRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
