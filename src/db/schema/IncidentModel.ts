import { timestamps } from "db/columns.helpers";
import { geometry, index, integer, pgTable, text } from "drizzle-orm/pg-core";

export const IncidentTable = pgTable(
	"Incidents",
	{
		id: integer().primaryKey().unique(),
		latlng: geometry("location", {
			type: "point",
			mode: "xy",
			srid: 4326,
		}).notNull(),
		text: text().notNull(),
		...timestamps.createdAt,
	},
	(table) => ({
		spatialIndex: index("spatial_index").using("gist", table.latlng),
	}),
);
