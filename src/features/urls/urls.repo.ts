/** @notice Library imports */
import { eq } from "drizzle-orm";
/// Local imports
import { database } from "@/database";
import { urls, type NewShortUrl } from "@/database/schema";

export class UrlsRepo {
  public static async insert(payload: NewShortUrl) {
    await database.insert(urls).values(payload);
  }

  public static async findById(shortUrl: string) {
    const result = await database.query.urls.findFirst({
      where: eq(urls.shortUrl, shortUrl),
    });
    return result;
  }
}
