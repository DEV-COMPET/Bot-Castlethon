import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteAnswerUseCase } from './makeDeleteTeamUseCase';

export const deleteAnswerBodySchema = z.object({
	teamName: z.string(),
	activityName: z.string()
});

export async function deleteAnswer(request: FastifyRequest, reply: FastifyReply) {

	const { activityName, teamName } = deleteAnswerBodySchema.parse(request.body);

	const deleteAnswerUseCase = makeDeleteAnswerUseCase()

	const answer = await deleteAnswerUseCase.execute({
		activityName, teamName
	});

	if (answer.isLeft()) {
		return reply
			.status(404)
			.send({ error_message: answer.value.message })
	}

	return reply.status(201).send({ deleted_answer: answer.value.deletedAnswer });
}
