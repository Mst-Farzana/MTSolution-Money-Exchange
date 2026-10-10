import { Pool } from 'pg';
import 'server-only';

const globalForDb = globalThis as typeof globalThis & {
  mtSolutionPool?: Pool;
};

export function getDbPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured on the server.');
  }

  if (!globalForDb.mtSolutionPool) {
    globalForDb.mtSolutionPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    });

    // Graceful shutdown (ঐচ্ছিক কিন্তু ভালো প্র্যাকটিস)
    process.on('beforeExit', async () => {
      await globalForDb.mtSolutionPool?.end();
    });
  }

  return globalForDb.mtSolutionPool;
}
