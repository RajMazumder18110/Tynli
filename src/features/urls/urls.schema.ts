/** @notice Library imports */
import { z } from "zod";

export const urlQuerySchema = z.string().min(6).max(6);
export const urlCreateSchema = z.object({
  longUrl: z.string().url(),
});
