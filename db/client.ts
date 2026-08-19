import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// إعداد اتصال PostgreSQL
const client = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 20,
});

export const db = drizzle(client, { schema });
export { client };