// .server.ts suffix prevents this module from being included in the
// client-side bundle - server-only code stays on the server.
import pg from 'pg';

const { Pool } = pg;

// Pool reuses connections across requests - more efficient than
// connecting/disconnecting per request.
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
