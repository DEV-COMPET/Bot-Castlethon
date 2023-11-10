import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCloseActivityUseCase } from './closeCreateActivityUseCase';

export const closeActivityBodySchema = z.object({
	name: z.string(),
});

export async function closeActivity(request: FastifyRequest, reply: FastifyReply) {

	const { name } = closeActivityBodySchema.parse(request.params);

	const closeActivityUseCase = makeCloseActivityUseCase()

	const activity = await closeActivityUseCase.execute({ name });

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
