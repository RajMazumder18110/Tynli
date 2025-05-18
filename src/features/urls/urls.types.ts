/** @notice Library imports */
import { type Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
/// Local imports
import type { UrlRoutes } from "./urls.route";
import type { ShortUrl } from "@/database/schema";

export type CreateUrlContext = Context<
  BlankEnv,
  UrlRoutes.CRATE_SHORT_URL,
  {
    in: {
      json: Pick<ShortUrl, "longUrl">;
    };
  }
>;

export type FindUrlContext = Context<
  BlankEnv,
  UrlRoutes.FIND_BY_ID,
  BlankInput
>;
