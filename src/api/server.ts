import fastify from "fastify";
import { env } from "@/env";
import "../database"

import { membersRoutes } from "./routes/competianos.routes";

const app = fastify();

app.register(membersRoutes)

app.listen({
	host: '0.0.0.0', 
	port: env.PORT,
}).then(() => {
	console.log(`server listening on port ${env.PORT}`);
});