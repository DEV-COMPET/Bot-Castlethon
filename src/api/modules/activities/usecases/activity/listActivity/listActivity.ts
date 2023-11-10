import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListActivityUseCase } from './makeListActivityUseCase';

export async function listActivity(request: FastifyRequest, reply: FastifyReply) {

	const listActivityUseCase = makeListActivityUseCase()

	const activitys = await listActivityUseCase.execute()

	if(activitys.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(activitys.value.activitys);
}
