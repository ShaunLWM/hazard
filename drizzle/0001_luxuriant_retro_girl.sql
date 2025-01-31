CREATE TABLE "Incidents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Incidents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"location" geometry(point) NOT NULL,
	"messageId" varchar(10) NOT NULL,
	"body" text NOT NULL,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "Incidents_messageId_unique" UNIQUE("messageId")
);
--> statement-breakpoint
CREATE INDEX "spatial_index" ON "Incidents" USING gist ("location");