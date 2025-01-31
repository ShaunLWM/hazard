import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL as string);

interface AccidentLocation {
	text: string;
	lat: number;
	long: number;
}

export function parseMessage(text: string): AccidentLocation | null {
	const batches = text.split("\n");
	const body = clean(replaceAccidentText(batches[0]));
	const regex = /https:\/\/www\.google\.com\/maps\/place\/(.*?),(.*?)$/;
	const match = clean(batches[1]).match(regex);

	if (!match || match.length < 3) {
		console.log("No match", match);
		return null;
	}

	return {
		text: removeLastDot(body.trim()),
		lat: Number(match[1].trim()),
		long: Number(match[2].trim()),
	};
}

export function removeLastDot(str: string) {
	if (str.endsWith(".")) {
		return str.slice(0, -1);
	}

	return str;
}

export function clean(str: string) {
	return str.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

export function replaceAccidentText(text: string) {
	const batch = text.split(" ");
	if (batch[0] === "Accident") {
		batch.splice(0, 2);
		return batch.join(" ");
	}

	return text
		.replace("Accident on ", "")
		.replace("Accident in", "")
		.replace("Accident at", "");
}
