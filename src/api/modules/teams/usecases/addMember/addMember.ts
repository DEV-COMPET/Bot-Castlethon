import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeAddMemberUseCase } from './makeAddMemberUseCase';

export const addMemberBodySchema = z.object({
	memberDiscordId: z.string(),
	teamName: z.string()
});

export async function addMember(request: FastifyRequest, reply: FastifyReply) {

	const { memberDiscordId, teamName } = addMemberBodySchema.parse(request.body);

	const addMemberUseCase = makeAddMemberUseCase()

	const team = await addMemberUseCase.execute({ memberDiscordId, teamName });

	if (team.isLeft()) {
		return reply
			.status(400)
			.send({
				message: team.value.message,
				code: reply.statusCode,
			})
	}

	return reply
		.status(201)
		.send(team.value.memberName);
}
