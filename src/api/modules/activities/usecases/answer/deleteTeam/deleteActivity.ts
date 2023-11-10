import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteAnswerUseCase } from './makeDeleteTeamUseCase';

export const deleteAnswerBodySchema = z.object({
	name: z.string(),
});

export async function deleteAnswer(request: FastifyRequest, reply: FastifyReply) {

	const { name } = deleteAnswerBodySchema.parse(request.body);

	const deleteAnswerUseCase = makeDeleteAnswerUseCase()

	const answer = await deleteAnswerUseCase.execute({
		name
	});

	if (answer.isLeft()) {
		return reply
			.status(404)
			.send({ error_message: answer.value.message })
	}

	return reply.status(201).send({ deleted_answer: answer.value.deletedAnswer });
}
