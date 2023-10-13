import { FastifyInstance } from 'fastify';
import { listTeam } from '../modules/teams/usecases/listTeam/listTeam';
import { createTeam } from '../modules/teams/usecases/createTeam/createTeam';
import { updateTeam } from '../modules/teams/usecases/updateTeam/updateTeam';
import { deleteTeam } from '../modules/teams/usecases/deleteTeam/deleteTeam';
import { addMember } from '../modules/teams/usecases/addMember/addMember';

export async function teamsRoutes(app: FastifyInstance) {
    app.get('/', listTeam)
    app.post('/', createTeam)
    app.put("/:nome", updateTeam)
    app.put("/addmember/", addMember)
    app.delete("/", deleteTeam)
}