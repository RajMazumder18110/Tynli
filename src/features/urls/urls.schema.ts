/** @notice Library imports */
import { z } from "zod";

export const urlQuerySchema = z.string().url();
export const urlCreateSchema = z.object({
  shortUrl: urlQuerySchema,
});
