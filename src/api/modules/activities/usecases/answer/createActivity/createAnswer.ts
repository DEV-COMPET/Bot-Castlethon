import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateAnswerUseCase } from './makeCreateAnswerUseCase';

export const createAnswerBodySchema = z.object({
	teamName: z.string(),
	answerText: z.string().optional(),
	answerDir: z.string().optional(),
	activityName: z.string()
});

export async function createAnswer(request: FastifyRequest, reply: FastifyReply) {

	const { teamName, answerDir, answerText, activityName } = createAnswerBodySchema.parse(request.body);

	const createAnswerUseCase = makeCreateAnswerUseCase()

	const answer = await createAnswerUseCase.execute({ teamName, answerDir, answerText, activityName });

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
		.send(answer.value.answer);
}
