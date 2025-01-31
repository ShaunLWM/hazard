import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
	updatedAt: {
		updatedAt: timestamp(),
	},
	createdAt: { createdAt: timestamp().defaultNow().notNull() },
	deletedAt: { deletedAt: timestamp() },
};
