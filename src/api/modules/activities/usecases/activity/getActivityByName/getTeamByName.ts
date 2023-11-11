import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeGetActivityByNameUseCase } from './makeGetTeamByNameUseCase';

const activityNameBodySchema = z.object({
	name: z.string()
})

export async function getActivityByName(request: FastifyRequest, reply: FastifyReply) {

	const { name } = activityNameBodySchema.parse(request.params);

	const getActivityByNameUseCase = makeGetActivityByNameUseCase()

	const activity = await getActivityByNameUseCase.execute({ name })

	if (activity.isLeft()) {
		return reply
			.status(404)
			.send({ message: "Membro não encontrado", error_message: activity.value.message })
	}

	return reply.status(201).send(activity.value.activity);
}
