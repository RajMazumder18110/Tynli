/** @notice Library imports */
/// Local imports
import { UrlsRepo } from "./urls.repo";
import { generateShortUrl } from "@/utils/helper";
import { type ShortUrl } from "@/database/schema";

export class UrlService {
  public static async createShortUrl(payload: Pick<ShortUrl, "longUrl">) {
    const shortUrl = await generateShortUrl();
    await UrlsRepo.insert({
      shortUrl,
      longUrl: payload.longUrl,
    });
    return shortUrl;
  }

  public static async findById(payload: Pick<ShortUrl, "shortUrl">) {
    const result = await UrlsRepo.findById(payload.shortUrl);
    return result;
  }
}
