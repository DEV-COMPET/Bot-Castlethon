import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { ActivityRepository, AnswerRepository as InterfaceCreateAnswerRepository } from "../../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Answer } from "../../../entities/answer.entity";
import { TeamRepository } from "@/api/modules/teams/repositories";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";

interface CreateAnswerUseCaseRequest {
  teamName: string,
  answerText?: string,
  answerDir?: string,
  activityName: string
}

type CreateAnswerUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { answer: Answer }
>

export class CreateAnswerUseCase {
  constructor(
    private readonly repository: InterfaceCreateAnswerRepository,
    private readonly teamsRepository: TeamRepository,
    private activityRepository: ActivityRepository
  ) { }

  async execute({ teamName, answerDir, answerText, activityName }: CreateAnswerUseCaseRequest): Promise<CreateAnswerUseCaseResponse> {

    const activityExists = await this.activityRepository.getByName(activityName);
    if (!activityExists)
      return left(new ResourceNotFoundError(`Activity ${activityName}`))

    const answerExists = await this.repository.getByTeamNameActivityName(teamName, activityName);
    if (answerExists)
      return left(new ResourceAlreadyExistsError(`'${teamName}'s answer from activity '${activityName}'`))

    const teamExists = await this.teamsRepository.getByName(teamName);
    if (!teamExists)
      return left(new ResourceNotFoundError("Team"))

    const answer = new Answer({ activityName, teamName, answerDir, answerText });

    await this.repository.create(answer);
    
    activityExists.answers?.push(answer._data);

    await this.activityRepository.update(activityName, activityExists);

    return right({ answer });
  }
}
