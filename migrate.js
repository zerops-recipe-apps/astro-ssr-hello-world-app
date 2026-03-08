// Migration script: creates and seeds the greetings table.
// Runs via zsc execOnce in initCommands - executes once per deploy
// version across all containers, preventing race conditions.
//
// Uses ESM import syntax to match package.json "type": "module".
// node_modules (including pg) is deployed alongside the app for
// Astro SSR (not a self-contained bundle), so pg resolves at runtime.
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function migrate() {
  const client = await pool.connect();
  try {
    // Idempotent schema: safe to run multiple times as defense-in-depth,
    // even though zsc execOnce prevents repeated execution.
    await client.query(`
      CREATE TABLE IF NOT EXISTS greetings (
        id      INTEGER PRIMARY KEY,
        message TEXT    NOT NULL
      )
    `);

    await client.query(`
      INSERT INTO greetings (id, message)
      VALUES (1, 'Hello from Zerops!')
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('Migration complete: greetings table ready.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
