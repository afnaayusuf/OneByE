CREATE TABLE "metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" double precision DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "metrics_name_unique" UNIQUE("name")
);
