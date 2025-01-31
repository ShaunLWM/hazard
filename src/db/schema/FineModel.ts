import { timestamps } from "db/columns.helpers";
import { geometry, integer, pgTable, text } from "drizzle-orm/pg-core";

export const IncidentTable = pgTable("Fines", {
	id: integer().primaryKey().unique(),
	latlng: geometry("location", {
		type: "point",
		mode: "xy",
		srid: 4326,
	}).notNull(),
	text: text().notNull(),
	...timestamps,
});
