/** @notice Library imports */
import { Hono } from "hono";
/// Local imports
import { UrlsController } from "./urls.controller";

/// Routes
export const enum UrlRoutes {
  FIND_BY_ID = "/:shortUrl",
  CRATE_SHORT_URL = "/",
}

export const urlsRoutes = new Hono({ strict: true })
  .get(UrlRoutes.FIND_BY_ID, UrlsController.findById)
  .post(UrlRoutes.CRATE_SHORT_URL, UrlsController.create);
