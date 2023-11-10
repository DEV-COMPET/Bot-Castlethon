import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateAnswerUseCase } from './makeUpdateTeamUseCase';

const updateAnswerDataBodySchema = z.object({
    teamName: z.string().optional(),
    answerText: z.string().optional(),
    answerDir: z.string().optional(),
})

const updateAnswerNameBodySchema = z.object({
    nome: z.string(),
});


export async function updateAnswer(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateAnswerNameBodySchema.parse(request.params)

    const updateAnswerDateParamsSchema = updateAnswerDataBodySchema.parse(request.body);

    const updateAnswerUseCase = makeUpdateAnswerUseCase()

    const answer = await updateAnswerUseCase.execute({ nome, updatedDate: updateAnswerDateParamsSchema })

    if (answer.isLeft()) {
        return reply
            .status(404)
            .send({
                code: reply.statusCode,
                message: "Membro não encontrado.",
                error_message: answer.value.message
            })
    }

    return reply.status(201).send({ updated_answer: answer.value.updatedAnswer });
}
