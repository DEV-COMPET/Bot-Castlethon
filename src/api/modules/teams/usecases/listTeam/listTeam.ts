import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListTeamUseCase } from './makeListTeamUseCase';

export async function listTeam(request: FastifyRequest, reply: FastifyReply) {

	const listTeamUseCase = makeListTeamUseCase()

	const teams = await listTeamUseCase.execute()

	if(teams.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(teams.value.teams);
}
