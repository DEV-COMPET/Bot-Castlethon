import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteMemberUseCase } from './makeDeleteMemberUseCase';

export const deleteMemberBodySchema = z.object({
	name: z.string(),
});

export async function deleteMember(request: FastifyRequest, reply: FastifyReply) {

	const { name } = deleteMemberBodySchema.parse(request.body);

	const deleteMemberUseCase = makeDeleteMemberUseCase()

	const member = await deleteMemberUseCase.execute({
		name
	});

	if (member.isLeft()) {
		return reply
			.status(404)
			.send({ error_message: member.value.message })
	}

	return reply.status(201).send({ deleted_member: member.value.deletedMember });
}
