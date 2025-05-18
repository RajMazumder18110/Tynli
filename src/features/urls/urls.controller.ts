/** @notice Library imports */
import type { ZodIssue } from "zod";
import { StatusCodes } from "http-status-codes";
/// Local imports
import { UrlService } from "./urls.service";
import type { ShortUrl } from "@/database/schema";
import type { ErrorResponse, SuccessResponse } from "@/types";
import { urlCreateSchema, urlQuerySchema } from "./urls.schema";
import type { CreateUrlContext, FindUrlContext } from "./urls.types";

export class UrlsController {
  public static async create(ctx: CreateUrlContext) {
    /// Grabbing & validating json
    const payload = await ctx.req.json();
    const result = urlCreateSchema.safeParse(payload);
    if (!result.success) {
      return ctx.json<ErrorResponse<ZodIssue[]>>(
        {
          status: false,
          code: "FormValidationError",
          errors: result.error.issues,
        },
        StatusCodes.BAD_REQUEST
      );
    }

    /// Creating new short url
    const shortUrl = await UrlService.createShortUrl(result.data);
    return ctx.json<SuccessResponse<{ shortUrl: string }>>(
      {
        status: true,
        data: {
          shortUrl,
        },
      },
      StatusCodes.CREATED
    );
  }

  public static async findById(ctx: FindUrlContext) {
    /// Grabbing & validating param
    const shortUrl = ctx.req.param("shortUrl");
    const result = urlQuerySchema.safeParse(shortUrl);
    if (!result.success) {
      return ctx.json<ErrorResponse<{ shortUrl: string }>>(
        {
          status: false,
          code: "InvalidShortUrl",
          errors: {
            shortUrl,
          },
        },
        StatusCodes.BAD_REQUEST
      );
    }

    /// Validating short url
    const data = await UrlService.findById({ shortUrl });
    if (!data) {
      return ctx.json<ErrorResponse<{ shortUrl: string }>>(
        {
          status: false,
          code: "InvalidShortUrl",
          errors: {
            shortUrl,
          },
        },
        StatusCodes.BAD_REQUEST
      );
    }

    /// Final response
    return ctx.json<SuccessResponse<ShortUrl>>(
      {
        status: true,
        data,
      },
      StatusCodes.OK
    );
  }
}
