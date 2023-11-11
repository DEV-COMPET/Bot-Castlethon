import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeAddActivityMessageUseCase } from './makeAddActivityMessageUseCase';

const messagesDataSchema = z.object({
	messsageId: z.string(),
	textChannelName: z.string()
});

export const addActivityMessageBodySchema = z.object({
	messagesData: z.array(messagesDataSchema),
	activityName: z.string(),
});

export async function addActivityMessage(request: FastifyRequest, reply: FastifyReply) {

	const { messagesData, activityName } = addActivityMessageBodySchema.parse(request.body);

	const addActivityMessageUseCase = makeAddActivityMessageUseCase()

	const activity = await addActivityMessageUseCase.execute({ activityName, messagesData });

	if (activity.isLeft()) {
		return reply
			.status(400)
			.send({
				message: activity.value.message,
				code: reply.statusCode,
			})
	}

	return reply
		.status(201)
		.send(activity.value.messages);
}
