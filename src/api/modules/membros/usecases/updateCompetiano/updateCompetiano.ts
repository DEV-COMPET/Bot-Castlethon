import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateCompetianoUseCase } from './makeUpdateCompetianoUseCase';

const updateUserDataBodySchema = z.object({
    nome: z.string().optional(),
    data_inicio: z.date().optional(),
    email: z.string().optional(),
    membro_ativo: z.boolean().optional(),
    tutor: z.boolean().optional(),
    scrum_master: z.boolean().optional(),
    intercambio: z.boolean().optional(),
    data_fim: z.date().optional(),
    lates: z.string().optional(),
    linkedin: z.string().optional(),
    depoimentos: z.string().optional(),
    url_imagem: z.string().optional(),
    advertencias: z.number().optional()
})

const updateUserNameBodySchema = z.object({
    nome: z.string(),
});


export async function updateCompetiano(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateUserNameBodySchema.parse(request.params)

    const updateUserDateParamsSchema = updateUserDataBodySchema.parse(request.body);

    const updateUserUseCase = makeUpdateCompetianoUseCase()

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
