import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateCompetianoUseCase } from './makeCreateCompetianoUseCase';
import { validateEmail, validateImgUrl, validateLinkedin } from '../../validators';

export const createUserBodySchema = z.object({
	nome: z.string(),
	email: z.string(),
	data_inicio: z.string(),
	url_imagem: z.string().optional(),
	linkedin: z.string().optional(),
	lates: z.string().optional(),
});

export async function createCompetiano(request: FastifyRequest, reply: FastifyReply) {
	
	const { email, nome, data_inicio, lates, linkedin, url_imagem } = createUserBodySchema.parse(request.body);

	const data_inicio_date = new Date(data_inicio);

	if (!validateEmail(email))
		return reply
			.status(422)
			.send({
				message: "Email inválido",
				code: reply.statusCode
			})

	if (url_imagem && !validateImgUrl(url_imagem))
		return reply.status(422).send({
			message:
				"Erro de validação, por favor forneça uma url válida do imgbb para a foto do novo membro!",
			code: reply.statusCode,
		});

	if (linkedin && !validateLinkedin(linkedin)) {
		return reply.status(422).send({
			message:
				"Erro de validação, por favor forneça uma url válida para o perfil do linkedin do novo membro!",
			code: reply.statusCode,
		});
	}

	const createUserUseCase = makeCreateCompetianoUseCase()

	const user = await createUserUseCase.execute({
		email, nome, data_inicio: data_inicio_date, lates, linkedin, url_imagem
	});

	if (user.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: user.value.message })
	}

	return reply
		.status(201)
		.send(user.value.competiano);
}
