import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteMemberUseCase } from './makeDeleteMemberUseCase';

export const deleteUserBodySchema = z.object({
	name: z.string(),
});

export async function deleteMember(request: FastifyRequest, reply: FastifyReply) {

	const { name } = deleteUserBodySchema.parse(request.body);

	const deleteUserUseCase = makeDeleteMemberUseCase()

	const user = await deleteUserUseCase.execute({
		name
	});

	if (user.isLeft()) {
		return reply
			.status(404)
			.send({ error_message: user.value.message })
	}

	return reply.status(201).send({ deleted_user: user.value.deletedMember });
}
