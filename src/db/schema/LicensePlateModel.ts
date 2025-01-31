import { timestamps } from "db/columns.helpers";
import { integer, pgTable, time, varchar } from "drizzle-orm/pg-core";

export const LicensePlateModel = pgTable("LicensePlates", {
	id: integer().primaryKey().unique(),
	plate: varchar({ length: 8 }).unique(),
	model: varchar({ length: 100 }).notNull(),
	expiry: time({ withTimezone: true }).notNull(),
	...timestamps.createdAt,
	...timestamps.updatedAt,
});
