import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeGetTeamByNameUseCase } from './makeGetTeamByNameUseCase';

const teamNameBodySchema = z.object({
	name: z.string()
})

export async function getTeamByName(request: FastifyRequest, reply: FastifyReply) {

	const { name } = teamNameBodySchema.parse(request.params);

	const getTeamByNameUseCase = makeGetTeamByNameUseCase()

	const team = await getTeamByNameUseCase.execute({ name })

	if (team.isLeft()) {
		return reply
			.status(404)
			.send({ message: "Membro não encontrado", error_message: team.value.message })
	}

	return reply.status(201).send({ updated_team: team.value.team });
}
