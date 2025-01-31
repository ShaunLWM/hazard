import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { IncidentRoutes } from "./routes/incidents";

export class Server {
	_app: Hono | undefined;
	_port = 3000;

	constructor() {
		this._app = new Hono()
			.use(logger())
			.use(compress())
			.use(cors())
			.get("/", (c) => {
				return c.text("Hello Hono!");
			})
			.route("/incidents", IncidentRoutes);

		serve({
			fetch: this._app.fetch,
			port: this._port,
		});

		console.log(`Server is running on http://localhost:${this._port}`);
	}
}
