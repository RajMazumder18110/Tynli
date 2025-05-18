/** @notice Library imports */
import { z } from "zod";

/// Schema
const envSchema = z.object({
  /// Optional
  PORT: z.string().default("3000"),

  /// Mandatory
  POSTGRES_CONNECTION_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
