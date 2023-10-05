import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateTeamUseCase } from './makeUpdateTeamUseCase';
import { createMemberBodySchema } from '@/api/modules/members/usecases/createMember/createMember';

const updateTeamDataBodySchema = z.object({
    name: z.string().optional(),
    profile_picture: z.string().optional(),
    members: z.array(createMemberBodySchema).optional(),
    institution: z.string().optional(),
})

const updateTeamNameBodySchema = z.object({
    nome: z.string(),
});


export async function updateTeam(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateTeamNameBodySchema.parse(request.params)

    const updateTeamDateParamsSchema = updateTeamDataBodySchema.parse(request.body);

    const updateTeamUseCase = makeUpdateTeamUseCase()

    const team = await updateTeamUseCase.execute({ nome, updatedDate: updateTeamDateParamsSchema })

    if (team.isLeft()) {
        return reply
            .status(404)
            .send({
                code: reply.statusCode,
                message: "Membro não encontrado.",
                error_message: team.value.message
            })
    }

    return reply.status(201).send({ updated_team: team.value.updatedTeam });
}
