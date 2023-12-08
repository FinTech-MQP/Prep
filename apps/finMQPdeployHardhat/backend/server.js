const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Enabling CORS for all routes

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If using SSL, uncomment the line below
  // ssl: { rejectUnauthorized: false }
});

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT permitid, verificationhash FROM PERMITS');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
