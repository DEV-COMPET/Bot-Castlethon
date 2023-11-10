import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import type { AnswerRepository, ActivityRepository as InterfaceDeleteActivityRepository } from "../../../repositories";
import { ActivityType } from "../../../entities/activity.entity";

interface DeleteActivityUseCaseRequest {
  name: string;
}

type DeleteActivityUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedActivity: ActivityType }
>

export class DeleteActivityUseCase {

  constructor(private repository: InterfaceDeleteActivityRepository,
    private answerRepository: AnswerRepository
  ) { }

  async execute({ name }: DeleteActivityUseCaseRequest): Promise<DeleteActivityUseCaseResponse> {

    const deletedActivity = await this.repository.deleteByName(name);
    if (!deletedActivity)
      return left(new ResourceNotFoundError("Activity"));

    deletedActivity.answers?.forEach(async answer => {
      await this.answerRepository.deleteByTeamNameActivityName(answer.teamName, answer.activityName);
    })

    return right({ deletedActivity });
  }
}
