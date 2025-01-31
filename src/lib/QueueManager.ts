import { Queue, Worker } from "bullmq";
import type { IncidentTable } from "db/schema/IncidentModel";
import type { NewMessageEvent } from "telegram/events";
import { parseMessage } from "./helper";

interface WorkerJobPayload {
	msg: NewMessageEvent;
}

export class QueueManager {
	newMessageQueue: Queue | undefined;
	newMessageWorker: Worker | undefined;

	constructor() {
		this.setup();
	}

	setup() {
		this.newMessageQueue = new Queue("NewMessage");
		this.newMessageWorker = new Worker<WorkerJobPayload>(
			"NewMessage",
			async (job) => {
				const { msg } = job.data;
				const parsedMessage = parseMessage(msg.message.text);
				if (!parsedMessage) {
					return;
				}

				const incident: typeof IncidentTable.$inferInsert = {
					latlng: {
						x: parsedMessage.lat,
						y: parsedMessage.long,
					},
					id: msg.message?.id,
					text: parsedMessage.text,
					createdAt: new Date(Number(msg.message.date) * 1000),
				};
				// await db.insert(IncidentTable).values(incident);
			},
		);
	}
}
