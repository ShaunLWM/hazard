import { TelegramClient } from "telegram";
import { NewMessage, type NewMessageEvent } from "telegram/events";
import { StringSession } from "telegram/sessions";
import { parseMessage } from "./helper";

const apiId = Number(process.env.TELEGRAM_APP_ID);
const apiHash = process.env.TELEGRAM_APP_HASH_ID as string;

export class TelegramListener {
	private _client: TelegramClient | undefined;
	private _session: string;

	constructor() {
		this._session = process.env.TELEGRAM_SESSION_ID || "";
	}

	async start() {
		this._client = new TelegramClient(
			new StringSession(this._session),
			apiId,
			apiHash,
			{
				connectionRetries: 3,
			},
		);
		await this._client.connect();
		console.log("Connected");
		await this._client.getMe();
		this._client.setParseMode("html");
		this._client.addEventHandler(
			(event: NewMessageEvent) => {
				const parsedMessage = parseMessage(event.message.message);
				if (!parsedMessage) {
					return console.log("Error", event.message.message);
				}

				console.log(parsedMessage);
			},
			new NewMessage({
				chats: [-1001486947378],
			}),
		);
	}
}
