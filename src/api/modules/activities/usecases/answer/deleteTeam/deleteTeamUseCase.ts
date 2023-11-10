import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import type { ActivityRepository, AnswerRepository as InterfaceDeleteAnswerRepository } from "../../../repositories";
import { AnswerType } from "../../../entities/answer.entity";

interface DeleteAnswerUseCaseRequest {
  activityName: string
  teamName: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedAnswer: AnswerType }
>

export class DeleteAnswerUseCase {

  constructor(
    private repository: InterfaceDeleteAnswerRepository,
    private activityRepository: ActivityRepository
  ) { }

  async execute({ activityName, teamName }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {

    const activity = await this.activityRepository.getByName(activityName);
    if (!activity)
      return left(new ResourceNotFoundError(`Activity ${activityName}`));

    activity.answers = activity.answers?.filter((answer) => answer.teamName !== teamName);
    this.activityRepository.update(activityName, activity);

    const deletedAnswer = await this.repository.deleteByTeamNameActivityName(teamName, activityName);
    if (!deletedAnswer)
      return left(new ResourceNotFoundError(`${teamName}'s answer to ${activityName} activity`));

    return right({ deletedAnswer });
  }
}
