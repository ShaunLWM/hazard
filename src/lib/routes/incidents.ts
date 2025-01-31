import { IncidentTable } from "db/schema/IncidentModel";
import { Hono } from "hono";
import { db } from "lib/helper";

export const IncidentRoutes = new Hono();

IncidentRoutes.get("/", async (c) => {
	const rows = await db
		.select({
			id: IncidentTable.id,
			x: IncidentTable.latlng,
		})
		.from(IncidentTable);

	return c.json(rows.map((row) => [row.id, row.x.x, row.x.y]));
});
