CREATE TABLE "urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"longUrl" text NOT NULL,
	"shortUrl" varchar(20) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "urls_shortUrl_unique" UNIQUE("shortUrl")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "shotUrlIndex" ON "urls" USING btree ("shortUrl");