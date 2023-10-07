import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListMemberUseCase } from './makeListMemberUseCase';

export async function listMember(request: FastifyRequest, reply: FastifyReply) {

	const listMemberUseCase = makeListMemberUseCase()

	const members = await listMemberUseCase.execute()

	if(members.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(members.value.members);
}
