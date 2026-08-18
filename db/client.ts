import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";
import * as schema from "./schema";

/**
 * PRODUCTION NOTE
 * -----------------------------------------------------------------------
 * This file is the ONLY place that needs to change to move to Postgres:
 *
 *   import postgres from "postgres";
 *   import { drizzle } from "drizzle-orm/postgres-js";
 *   const client = postgres(process.env.DATABASE_URL!);
 *   export const db = drizzle(client, { schema });
 *
 * Everything else (schema.ts, queries, server actions) is written against
 * the Drizzle query API and works unchanged against either driver.
 * -----------------------------------------------------------------------
 */

const dbPath =
  process.env.DATABASE_URL?.replace("file:", "") ??
  path.join(process.cwd(), "db", "portfolio.db");

declare global {
  // eslint-disable-next-line no-var
  var __sqlite: Database.Database | undefined;
}

const sqlite = global.__sqlite ?? new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

if (process.env.NODE_ENV !== "production") {
  global.__sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
export { sqlite };
