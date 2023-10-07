import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteTeamUseCase } from './makeDeleteTeamUseCase';

export const deleteTeamBodySchema = z.object({
	name: z.string(),
});

export async function deleteTeam(request: FastifyRequest, reply: FastifyReply) {

	const { name } = deleteTeamBodySchema.parse(request.body);

	const deleteTeamUseCase = makeDeleteTeamUseCase()

	const team = await deleteTeamUseCase.execute({
		name
	});

	if (team.isLeft()) {
		return reply
			.status(404)
			.send({ error_message: team.value.message })
	}

	return reply.status(201).send({ deleted_team: team.value.deletedTeam });
}
