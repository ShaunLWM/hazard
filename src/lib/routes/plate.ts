import { LicensePlateModel } from "db/schema/LicensePlateModel";
import { desc, eq, ilike } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "lib/helper";

export const PlateRoutes = new Hono();

PlateRoutes.get("/:plate", async (c) => {
	const { plate } = c.req.param();
	const row = await db
		.select({
			plate: LicensePlateModel.plate,
			model: LicensePlateModel.model,
			expiry: LicensePlateModel.expiry,
			updatedAt: LicensePlateModel.updatedAt,
		})
		.from(LicensePlateModel)
		.where(eq(LicensePlateModel.plate, plate.toUpperCase()));
	return c.json(row);
});

PlateRoutes.post("/s", async (c) => {
	const body = await c.req.json<{ q: string }>();
	const rows = await db
		.select({
			plate: LicensePlateModel.plate,
			model: LicensePlateModel.model,
			expiry: LicensePlateModel.expiry,
			updatedAt: LicensePlateModel.updatedAt,
		})
		.from(LicensePlateModel)
		.where(ilike(LicensePlateModel.plate, `%${body.q}$`));
	return c.json(rows);
});

PlateRoutes.get("/recent", async (c) => {
	const rows = await db
		.select({
			plate: LicensePlateModel.plate,
			model: LicensePlateModel.model,
			expiry: LicensePlateModel.expiry,
			updatedAt: LicensePlateModel.updatedAt,
		})
		.from(LicensePlateModel)
		.orderBy(desc(LicensePlateModel.updatedAt))
		.limit(10);

	return c.json(rows);
});
