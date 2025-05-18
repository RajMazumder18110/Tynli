/** @notice Library imports */
import { describe, it, expect, spyOn, mock, beforeEach } from "bun:test";
/// Local imports
import { UrlsRepo } from "@/features/urls/urls.repo";
import { UrlService } from "@/features/urls/urls.service";
import type { NewShortUrl, ShortUrl } from "@/database/schema";

describe("Urls services", () => {
  beforeEach(() => {
    mock.restore();
  });

  it("Should create and return the short url.", async () => {
    /// Arrange
    const payload: NewShortUrl = {
      shortUrl: "123456",
      longUrl: "https://google.com",
    };
    mock.module("nanoid", () => {
      return {
        nanoid: (length: number) => payload.shortUrl,
      };
    });
    const mockInsert = spyOn(UrlsRepo, "insert").mockImplementationOnce(
      async () => {}
    );

    /// Act
    const actualShortUrl = await UrlService.createShortUrl({
      longUrl: payload.longUrl,
    });

    // Expect
    expect(actualShortUrl).toBe(payload.shortUrl);
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith(payload);
  });

  it("Should return the url data when `shortId` available.", async () => {
    /// Arrange
    const expectedResult: ShortUrl = {
      id: "xxxx",
      shortUrl: "123456",
      longUrl: "https://google.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockFindById = spyOn(UrlsRepo, "findById").mockResolvedValueOnce(
      expectedResult
    );

    /// Act
    const actualResult = await UrlService.findById({
      shortUrl: expectedResult.shortUrl,
    });

    // Expect
    expect(actualResult).toBeDefined();
    expect(actualResult!.shortUrl).toBe(expectedResult.shortUrl);
    expect(actualResult!.longUrl).toBe(expectedResult.longUrl);
    expect(mockFindById).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(expectedResult.shortUrl);
  });

  it("Should return undefined when `shortId` not available.", async () => {
    /// Arrange
    const targetUrl = "xxx";
    const mockFindById = spyOn(UrlsRepo, "findById").mockResolvedValueOnce(
      undefined
    );

    /// Act
    const actualResult = await UrlService.findById({
      shortUrl: targetUrl,
    });

    // Expect
    expect(actualResult).not.toBeDefined();
    expect(mockFindById).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(targetUrl);
  });
});
