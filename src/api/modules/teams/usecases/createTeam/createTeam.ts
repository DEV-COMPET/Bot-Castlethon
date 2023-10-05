import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { validateImgUrl } from '../../validators';
import { makeCreateTeamUseCase } from './makeCreateTeamUseCase';
import { createMemberBodySchema } from '@/api/modules/members/usecases/createMember/createMember';

export const createTeamBodySchema = z.object({
	name: z.string(),
	profile_picture: z.string().optional(),
	members: z.array(createMemberBodySchema).optional(),
	institution: z.string(),
});

export async function createTeam(request: FastifyRequest, reply: FastifyReply) {

	const { institution, members, name, profile_picture } = createTeamBodySchema.parse(request.body);

	if (profile_picture && !validateImgUrl(profile_picture))
		return reply.status(422).send({
			message:
				"Erro de validação, por favor forneça uma url válida do imgbb para a foto do novo membro!",
			code: reply.statusCode,
		});

	const createUserUseCase = makeCreateTeamUseCase()

	const user = await createUserUseCase.execute({ institution, members, name, profile_picture });

	if (user.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: user.value.message })
	}

	return reply
		.status(201)
		.send(user.value.team);
}
