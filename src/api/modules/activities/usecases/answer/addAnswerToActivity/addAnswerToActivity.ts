import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeAddAnswerToActivityUseCase } from './makeAddAnswerToActivityUseCase';

export const addAnswerToActivityBodySchema = z.object({
	activityName: z.string(),
	answerName: z.string(),
	teamName: z.string()
});

export async function addAnswerToActivity(request: FastifyRequest, reply: FastifyReply) {

	const { activityName, answerName, teamName } = addAnswerToActivityBodySchema.parse(request.body);

	const addAnswerToActivityUseCase = makeAddAnswerToActivityUseCase()

	const answer = await addAnswerToActivityUseCase.execute({ activityName, answerName, teamName });

	if (answer.isLeft()) {
		return reply
			.status(400)
			.send({
				message: answer.value.message,
				code: reply.statusCode,
			})
	}

	return reply
		.status(201)
		.send(answer.value.activityName);
}
