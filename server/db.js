
const { Pool } = require('pg');
require('dotenv').config(); // This line is crucial!

// This uses the URL from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;