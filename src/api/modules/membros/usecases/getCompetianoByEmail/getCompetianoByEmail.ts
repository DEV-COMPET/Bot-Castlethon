import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { validateEmail } from '../../validators';
import { makeGetCompetianoByEmailUseCase } from './makeGetCompetianoByEmailUseCase';

const userEmailBodySchema = z.object({
	email: z.string()
})

export async function getCompetianoByEmail(request: FastifyRequest, reply: FastifyReply) {

	const { email } = userEmailBodySchema.parse(request.params);

	if (!validateEmail(email))
		return reply
			.status(422)
			.send({ message: "Entrada inválida! O email fornecido não corresponde a um email válido para busca." })

	const getCompetianoByEmailUseCase = makeGetCompetianoByEmailUseCase()

	const user = await getCompetianoByEmailUseCase.execute({ email })

	if (user.isLeft()) {
		return reply
			.status(404)
			.send({ message: "Membro não encontrado", error_message: user.value.message })
	}

	return reply.status(201).send({ updated_user: user.value.competiano });
}
