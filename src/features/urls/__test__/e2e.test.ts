/** @notice Library imports */
import type { ZodIssue } from "zod";
import { testClient } from "hono/testing";
import { StatusCodes } from "http-status-codes";
import { describe, it, expect, mock, beforeEach } from "bun:test";
/// Local imports
import { database } from "@/database";
import { UrlsRepo } from "../urls.repo";
import { generateShortUrl } from "@/utils/helper";
import { urlsRoutes } from "@/features/urls/urls.route";
import type { ErrorResponse, SuccessResponse } from "@/types";
import { urls, type NewShortUrl, type ShortUrl } from "@/database/schema";

const $urls = testClient(urlsRoutes);

describe("Urls", () => {
  beforeEach(async () => {
    mock.restore();

    await database.transaction(async (tx) => {
      await tx.delete(urls);
    });
  });

  describe("Success", () => {
    it("[201] Should create and return the short url.", async () => {
      /// Arrange
      const longUrl = "https://google.com";

      /// Act
      const response = await $urls.index.$post({
        json: {
          longUrl,
        },
      });
      const responseJson = (await response.json()) as SuccessResponse<{
        shortUrl: string;
      }>;

      // Expect
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(responseJson.status).toBeTrue();
      expect(responseJson.data).toHaveProperty("shortUrl");
    });

    it("[200] Should return the short url details when url is present.", async () => {
      /// Arrange
      const payload: NewShortUrl = {
        shortUrl: await generateShortUrl(),
        longUrl: "https://google.com",
      };
      await UrlsRepo.insert(payload);

      /// Act
      const response = await $urls[":shortUrl"].$get({
        param: { shortUrl: payload.shortUrl },
      });
      const responseJson = (await response.json()) as SuccessResponse<ShortUrl>;

      // Expect
      expect(response.status).toBe(StatusCodes.OK);
      expect(responseJson.status).toBeTrue();
      expect(responseJson).toHaveProperty("data.shortUrl", payload.shortUrl);
      expect(responseJson).toHaveProperty("data.longUrl", payload.longUrl);
    });
  });

  describe("Failure", () => {
    it("[400] Should return error response when url is invalid.", async () => {
      /// Arrange
      const shortUrl = "123";

      /// Act
      const response = await $urls[":shortUrl"].$get({
        param: { shortUrl },
      });
      const responseJson = (await response.json()) as ErrorResponse<{
        shortUrl: string;
      }>;

      // Expect
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(responseJson.status).toBeFalse();
      expect(responseJson).toHaveProperty("code", "InvalidShortUrl");
      expect(responseJson).toHaveProperty("errors", { shortUrl });
    });

    it("[400] Should return error response when url is not available.", async () => {
      /// Arrange
      const shortUrl = "123456";
      /// Act
      const response = await $urls[":shortUrl"].$get({
        param: { shortUrl },
      });
      const responseJson = (await response.json()) as ErrorResponse<{
        shortUrl: string;
      }>;

      // Expect
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(responseJson.status).toBeFalse();
      expect(responseJson).toHaveProperty("code", "InvalidShortUrl");
      expect(responseJson).toHaveProperty("errors", { shortUrl });
    });

    it("[400] Should return error response when invalid body passed while creating.", async () => {
      /// Arrange
      const longUrl = "123456";

      /// Act
      const response = await $urls.index.$post({
        json: { longUrl },
      });
      const responseJson = (await response.json()) as ErrorResponse<ZodIssue[]>;

      // Expect
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(responseJson.status).toBeFalse();
      expect(responseJson).toHaveProperty("code", "FormValidationError");
    });
  });
});
