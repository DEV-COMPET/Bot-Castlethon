import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeOpenActivityUseCase } from './openCreateActivityUseCase';

export const openActivityBodySchema = z.object({
	name: z.string(),
});

export async function openActivity(request: FastifyRequest, reply: FastifyReply) {

	const { name } = openActivityBodySchema.parse(request.params);

	const openActivityUseCase = makeOpenActivityUseCase()

	const activity = await openActivityUseCase.execute({ name });

	if (activity.isLeft()) {
		return reply
			.status(400)
			.send({
				message: activity.value.message,
				code: reply.statusCode,
			})
	}

	return reply
		.status(201)
		.send(activity.value.name);
}
