import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateMemberUseCase } from './makeCreateMemberUseCase';
import { validateEmail, validateImgUrl } from '../../validators';

export const createMemberBodySchema = z.object({
	name: z.string(),
	profile_picture: z.string().optional(),
	email: z.string(),
	role: z.string(),
	institution: z.string(),
	teamName: z.string().optional(),
	discord_id: z.string(),
	discord_username: z.string(),
	discord_nickname: z.string().optional()
});

export async function createMember(request: FastifyRequest, reply: FastifyReply) {

	const { email, institution, name, role, teamName, profile_picture, discord_id, discord_username, discord_nickname } = createMemberBodySchema.parse(request.body);

	if (!validateEmail(email))
		return reply
			.status(422)
			.send({
				message: "Email inválido",
				code: reply.statusCode
			})

	if (profile_picture && !validateImgUrl(profile_picture))
		return reply.status(422).send({
			message:
				"Erro de validação, por favor forneça uma url válida do imgbb para a foto do novo membro!",
			code: reply.statusCode,
		});

	const createMemberUseCase = makeCreateMemberUseCase()

	const member = await createMemberUseCase.execute({
		email, institution, name, role, profile_picture, teamName, discord_id, discord_username, discord_nickname
	});

	if (member.isLeft()) {
		return reply
			.status(400)
			.send({
				message: member.value.message,
				code: reply.statusCode,
			})
	}

	return reply
		.status(201)
		.send(member.value.member);
}
