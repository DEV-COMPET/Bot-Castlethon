import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListCompetianoUseCase } from './makeListCompetianoUseCase';

export async function listCompetiano(request: FastifyRequest, reply: FastifyReply) {

	const listCompetianoUseCase = makeListCompetianoUseCase()

	const competianos = await listCompetianoUseCase.execute()

	if(competianos.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(competianos.value.competianos);
}
