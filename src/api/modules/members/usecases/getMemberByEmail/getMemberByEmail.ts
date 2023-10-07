import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { validateEmail } from '../../validators';
import { makeGetMemberByEmailUseCase } from './makeGetMemberByEmailUseCase';

const memberEmailBodySchema = z.object({
	email: z.string()
})

export async function getMemberByEmail(request: FastifyRequest, reply: FastifyReply) {

	const { email } = memberEmailBodySchema.parse(request.params);

	if (!validateEmail(email))
		return reply
			.status(422)
			.send({ message: "Entrada inválida! O email fornecido não corresponde a um email válido para busca." })

	const getMemberByEmailUseCase = makeGetMemberByEmailUseCase()

	const member = await getMemberByEmailUseCase.execute({ email })

	if (member.isLeft()) {
		return reply
			.status(404)
			.send({ message: "Membro não encontrado", error_message: member.value.message })
	}

	return reply.status(201).send({ updated_member: member.value.member });
}
