import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateActivityUseCase } from './makeActivityTeamUseCase';

const updateActivityDataBodySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    descriptionFileDir: z.string().optional(),
})

const updateActivityNameBodySchema = z.object({
    nome: z.string(),
});

export async function updateActivity(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateActivityNameBodySchema.parse(request.params)

    const updateActivityDateParamsSchema = updateActivityDataBodySchema.parse(request.body);

    const updateActivityUseCase = makeUpdateActivityUseCase()

    const activity = await updateActivityUseCase.execute({ nome, updatedDate: updateActivityDateParamsSchema })

    if (activity.isLeft()) {
        return reply
            .status(404)
            .send({
                code: reply.statusCode,
                message: "Membro não encontrado.",
                error_message: activity.value.message
            })
    }

    return reply.status(201).send({ updated_activity: activity.value.updatedActivity });
}
