const express = require("express");
const cors = require("cors");
const { prisma } = require("database");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors()); // Enabling CORS for all routes

// ensure proper connection URL
//console.log(process.env.BLOCKCHAIN_DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.BLOCKCHAIN_DATABASE_URL,
  // If using SSL, uncomment the line below
  // ssl: { rejectUnauthorized: false }
});

app.get("/api/listing", async (req, res) => {
  // use prisma to get all listings from the database directly
  return res.json(
    await prisma.listing.findMany({
      include: {
        address: {
          include: {
            parcel: {
              include: {
                assessments: true,
                landUse: true,
                zone: true,
                femaFloodZone: true,
              },
            },
          },
        },
        analyses: true,
      },
    })
  );
});

app.post("/api/listing", async (req, res) => {
  // handle new data
  // data in format:
  /*
  {
    listing: createdListing, 
    analyses: analyses 
  }
  */

  console.log(req.json);
  return res.json({ msg: "Not implemented" });
});

app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT permitid, verificationhash FROM PERMITS"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
