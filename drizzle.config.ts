/** @notice Library imports */
import { defineConfig } from "drizzle-kit";
/// Local imports
import { env } from "@/env";

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/database/schema/index.ts",
  dbCredentials: {
    url: env.POSTGRES_CONNECTION_URL,
  },
});
