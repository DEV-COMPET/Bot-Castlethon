import fastify from "fastify";
import { env } from "@/env";
import "../database"

const port = env.PORT
const app = fastify();

app.listen({
	host: '0.0.0.0', // auxilia front-end a conectar com aplicação mais pra frente
	port: port,
}).then(() => {
	console.log(`server listening on port ${port}`);
});