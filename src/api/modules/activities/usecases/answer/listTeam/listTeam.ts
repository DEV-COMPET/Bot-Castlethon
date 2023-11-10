import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListAnswerUseCase } from './makeListTeamUseCase';

export async function listAnswer(request: FastifyRequest, reply: FastifyReply) {

	const listAnswerUseCase = makeListAnswerUseCase()

	const answers = await listAnswerUseCase.execute()

	if(answers.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(answers.value.answers);
}
