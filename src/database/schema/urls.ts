/** @notice Library imports */
import {
  pgTable,
  uuid,
  varchar,
  text,
  uniqueIndex,
  timestamp,
} from "drizzle-orm/pg-core";

export const urls = pgTable(
  "urls",
  {
    /// Core
    id: uuid().primaryKey().notNull(),
    longUrl: text().notNull(),
    shortUrl: varchar({ length: 20 }).notNull().unique(),

    /// timestamps
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("shotUrlIndex").on(table.shortUrl)]
);

/// Types
export type ShortUrl = typeof urls.$inferSelect;
export type NewShortUrl = Pick<ShortUrl, "longUrl" | "shortUrl">;
