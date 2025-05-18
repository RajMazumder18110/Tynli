/** @notice Library imports */
import { nanoid } from "nanoid";

export const generateShortUrl = async (): Promise<string> => {
  return nanoid(6);
};
