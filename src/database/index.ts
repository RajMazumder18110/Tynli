/** @notice Library imports */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
/// Local imports
import { env } from "@/env";
import * as schema from "@/database/schema";

const postgresClient = postgres(env.POSTGRES_CONNECTION_URL);
export const database = drizzle({ client: postgresClient, schema });
