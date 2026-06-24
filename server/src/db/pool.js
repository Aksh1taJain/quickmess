import pg from 'pg';
import { env } from '../config/env.js';

if (!env.databaseUrl) {
  console.warn('DATABASE_URL is not set. Database-backed API calls will fail until configured.');
}

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
});
