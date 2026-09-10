const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL in backend/.env before starting or migrating.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 });
pool.on('error', () => console.error('Unexpected PostgreSQL pool connection error'));
module.exports = pool;
