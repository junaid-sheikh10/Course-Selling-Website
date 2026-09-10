const fs = require('node:fs/promises');
const path = require('node:path');
const pool = require('../src/db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(330001)');
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    const directory = path.resolve(__dirname, '../migrations');
    const files = (await fs.readdir(directory)).filter(name => name.endsWith('.sql')).sort();
    for (const name of files) {
      const applied = await client.query('SELECT name FROM schema_migrations WHERE name = $1', [name]);
      if (applied.rowCount) continue;
      await client.query(await fs.readFile(path.join(directory, name), 'utf8'));
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
      console.log(`Applied ${name}`);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

migrate().catch(error => {
  console.error('Migration failed:', error.code || 'database error');
  process.exitCode = 1;
}).finally(() => pool.end());
