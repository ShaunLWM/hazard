import input from "@inquirer/input";
import "dotenv/config";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const apiId = process.env.TELEGRAM_APP_ID;
const apiHash = process.env.TELEGRAM_APP_HASH_ID;
const stringSession = new StringSession(""); // fill this later with the value from session.save()

if (!apiId || !apiHash) {
	throw new Error("Missing API ID or hash");
}

(async () => {
	console.log("Loading interactive example...");
	const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
		connectionRetries: 5,
	});

	await client.start({
		phoneNumber: async () =>
			await input({ message: "Please enter your number: " }),
		password: async () =>
			await input({ message: "Please enter your password: " }),
		phoneCode: async () =>
			await input({ message: "Please enter the code you received: " }),
		onError: (err) => console.log(err),
	});

	console.log("You should now be connected.");
	console.log(client.session.save()); // Save this string to avoid logging in again
})();
