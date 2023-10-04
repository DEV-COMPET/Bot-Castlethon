import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateMemberUseCase } from './makeUpdateMemberUseCase';

const updateUserDataBodySchema = z.object({
	name: z.string().optional(),
	profile_picture: z.string().optional(),
	email: z.string().optional(),
	role: z.string().optional(),
	institution: z.string().optional(),
	teamId: z.string().optional(),
})

const updateUserNameBodySchema = z.object({
    nome: z.string(),
});


export async function updateMember(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateUserNameBodySchema.parse(request.params)

    const updateUserDateParamsSchema = updateUserDataBodySchema.parse(request.body);

    const updateUserUseCase = makeUpdateMemberUseCase()

    const user = await updateUserUseCase.execute({ nome, updatedDate: updateUserDateParamsSchema })

    if (user.isLeft()) {
        return reply
            .status(404)
            .send({
                code: reply.statusCode,
                message: "Membro não encontrado.",
                error_message: user.value.message
            })
    }

    return reply.status(201).send({ updated_user: user.value.updatedMember });
}
