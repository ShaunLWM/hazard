import "dotenv/config";

import { IncidentTable } from "db/schema/IncidentModel";
import { drizzle } from "drizzle-orm/node-postgres";
import { clean, removeLastDot, replaceAccidentText } from "lib/helper";
import chunk from "lodash.chunk";
import { readFileSync, writeFileSync } from "node:fs";

interface LatLong {
	latitude: number;
	longitude: number;
}

function extractLatLong(url: string): LatLong | null {
	const regex = /maps\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/;
	const match = url.match(regex);

	if (!match) {
		return null;
	}

	return {
		latitude: Number.parseFloat(match[1]),
		longitude: Number.parseFloat(match[2]),
	};
}

interface ResultJson {
	messages: Array<Message>;
}

interface Message {
	id: number;
	type: "message" | string;
	date: string;
	date_unixtime: string;
	from: string;
	from_id: string;
	text_entities: TextEntity[];
}

export interface TextEntity {
	type: "plain" | "link";
	text: string;
}

const db = drizzle(process.env.DATABASE_URL as string);

async function main() {
	const json = JSON.parse(
		readFileSync("./src/scripts/result.json", "utf-8"),
	) as ResultJson;
	if (!json.messages || !Array.isArray(json.messages)) {
		throw new Error("No messages");
	}

	const arr: Array<typeof IncidentTable.$inferInsert> = [];

	for (const message of json.messages) {
		if (message.type !== "message") {
			continue;
		}

		if (message.text_entities.length === 0) {
			continue;
		}

		if (message?.text_entities.length < 2) {
			writeFileSync(`${message.id}.json`, JSON.stringify(message));
			continue;
		}

		const isFirstElementText = message.text_entities[0].type === "plain";
		const isSecondElementLink = message.text_entities[1].type === "link";
		if (!isFirstElementText || !isSecondElementLink) {
			continue;
		}

		const msg = replaceAccidentText(
			removeLastDot(clean(message.text_entities[0].text)),
		);
		const link = extractLatLong(`${msg} ${message.text_entities[1].text}`);
		if (!link) {
			console.error(message?.text_entities);
			return;
		}

		const incident: typeof IncidentTable.$inferInsert = {
			latlng: {
				x: link.latitude,
				y: link.longitude,
			},
			id: message?.id,
			text: msg,
			createdAt: new Date(Number(message.date_unixtime) * 1000),
		};

		arr.push(incident);
		console.log("Inserted", incident.id);
	}

	for (const c of chunk(arr, 5000)) {
		await db.insert(IncidentTable).values(c);
	}
}

main();
