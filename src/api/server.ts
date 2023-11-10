import fastify from "fastify";
import { env } from "@/env";
import "../database"

import { membersRoutes } from "./routes/members.routes";
import { teamsRoutes } from "./routes/teams.routes";
import { activitysRoutes, answersRoutes } from "./routes/activities.routes";

const app = fastify();

app.register(membersRoutes, { prefix: 'member' })
app.register(teamsRoutes, { prefix: 'team' })
app.register(activitysRoutes, { prefix: 'activity' })
app.register(answersRoutes, { prefix: 'answer' })

app.listen({
	host: '0.0.0.0', 
	port: env.PORT,
}).then(() => {
	console.log(`server listening on port ${env.PORT}`);
});