import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateActivityUseCase } from './makeCreateActivityUseCase';

export const createActivityBodySchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	descriptionFileDir: z.string().optional(),
});

export async function createActivity(request: FastifyRequest, reply: FastifyReply) {

	const { name, description, descriptionFileDir } = createActivityBodySchema.parse(request.body);

	const createActivityUseCase = makeCreateActivityUseCase()

	const activity = await createActivityUseCase.execute({ name, description, descriptionFileDir });

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
		.send(activity.value.activity);
}
