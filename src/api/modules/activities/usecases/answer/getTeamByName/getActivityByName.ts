import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeGetAnswerByNameUseCase } from './makeGetTeamByNameUseCase';

const answerNameBodySchema = z.object({
	name: z.string()
})

export async function getAnswerByName(request: FastifyRequest, reply: FastifyReply) {

	const { name } = answerNameBodySchema.parse(request.params);

	const getAnswerByNameUseCase = makeGetAnswerByNameUseCase()

	const answer = await getAnswerByNameUseCase.execute({ name })

	if (answer.isLeft()) {
		return reply
			.status(404)
			.send({ message: "Membro não encontrado", error_message: answer.value.message })
	}

	return reply.status(201).send({ updated_answer: answer.value.answer });
}
