import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import type { ActivityRepository, AnswerRepository as InterfaceAddAnswerToActivityRepository } from "../../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";

interface AddAnswerToActivityUseCaseRequest {
  activityName: string,
  answerName: string,
  teamName: string
}

type AddAnswerToActivityUseCaseResponse = Either<
  ResourceNotFoundError | ResourceAlreadyExistsError,
  { activityName: string }
>

export class AddAnswerToActivityUseCase {
  constructor(private repository: InterfaceAddAnswerToActivityRepository,
    private activitysRepository: ActivityRepository) { }

  async execute({ activityName, answerName, teamName }: AddAnswerToActivityUseCaseRequest): Promise<AddAnswerToActivityUseCaseResponse> {

    const activityExists = await this.activitysRepository.getByName(activityName)
    if (!activityExists)
      return left(new ResourceNotFoundError("Activity"))

    const answerExists = await this.repository.getByName(answerName);
    if (!answerExists)
      return left(new ResourceNotFoundError("Answer"))

    if (activityExists.answers) {
      const activityAlreadyAdded = activityExists.answers.findIndex(answer => answer.teamName === teamName)
      if (activityAlreadyAdded !== -1)
        return left(new ResourceAlreadyExistsError("Activity"))
    }

    activityExists.answers?.push(answerExists)

    await this.repository.update(answerName, answerExists);

    return right({ activityName: activityExists.name });
  }
}
