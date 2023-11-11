import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { ActivityRepository as InterfaceAddActivityMessageRepository } from "../../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ActivityMessage } from "../../../entities/activity.entity";

interface AddActivityMessageUseCaseRequest {
  messagesData: ActivityMessage[]
  activityName: string
}

type AddActivityMessageUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { messages: ActivityMessage[] }
>

export class AddActivityMessageUseCase {
  constructor(private readonly repository: InterfaceAddActivityMessageRepository) { }

  async execute({ messagesData, activityName }: AddActivityMessageUseCaseRequest): Promise<AddActivityMessageUseCaseResponse> {

    const activityExists = await this.repository.getByName(activityName);
    if (!activityExists)
      return left(new ResourceNotFoundError("Activity"))

    messagesData.forEach(async (messageData) => {
      activityExists.chatMessagesIds.push(messageData)
    })

    await this.repository.update(activityName, activityExists)

    return right({ messages: activityExists.chatMessagesIds });
  }
}
