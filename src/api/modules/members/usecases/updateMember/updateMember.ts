import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateMemberUseCase } from './makeUpdateMemberUseCase';

export const updateMemberDataBodySchema = z.object({
    name: z.string().optional(),
    profile_picture: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional(),
    institution: z.string().optional(),
    teamName: z.string().optional(),
    discord_id: z.string().optional(),
    discord_username: z.string().optional(),
    discord_nickname: z.string().optional()
})

const updateMemberNameBodySchema = z.object({
    nome: z.string(),
});


export async function updateMember(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateMemberNameBodySchema.parse(request.params)

    const updateMemberDateParamsSchema = updateMemberDataBodySchema.parse(request.body);

    const updateMemberUseCase = makeUpdateMemberUseCase()

    const member = await updateMemberUseCase.execute({ nome, updatedDate: updateMemberDateParamsSchema })

    if (member.isLeft()) {
        return reply
            .status(404)
            .send({
                code: reply.statusCode,
                message: "Membro não encontrado.",
                error_message: member.value.message
            })
    }

    return reply.status(201).send({ updated_member: member.value.updatedMember });
}
