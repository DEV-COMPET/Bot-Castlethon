import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteActivityUseCase } from './makeDeleteActivityUseCase';

export const deleteActivityBodySchema = z.object({
	name: z.string(),
});

export async function deleteActivity(request: FastifyRequest, reply: FastifyReply) {

	const { name } = deleteActivityBodySchema.parse(request.body);

	const deleteActivityUseCase = makeDeleteActivityUseCase()

	const activity = await deleteActivityUseCase.execute({
		name
	});

	if (activity.isLeft()) {
		return reply
			.status(404)
			.send({ error_message: activity.value.message })
	}

	return reply.status(201).send({ deleted_activity: activity.value.deletedActivity });
}
