const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Ye line Render/Supabase ke liye zaroori hai
  }
});

module.exports = pool;