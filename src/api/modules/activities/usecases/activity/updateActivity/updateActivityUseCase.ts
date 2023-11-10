import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"
import { ActivityData } from "../../../repositories/defaultMongoDBRepository/activityRepository";
import { ActivityType } from "../../../entities/activity.entity";
import { ActivityRepository } from "../../../repositories";

interface UpdateActivityUseCaseRequest {
  nome: string
  updatedDate: ActivityData
}

type UpdateActivityUseCaseResponse = Either<
  ResourceNotFoundError,
  { updatedActivity: ActivityType }
>

export class UpdateActivityUseCase {

  constructor(private repository: ActivityRepository) { }

  async execute({ nome, updatedDate }: UpdateActivityUseCaseRequest): Promise<UpdateActivityUseCaseResponse> {
    const activity = await this.repository.getByName(nome);

    if (!activity)
      return left(new ResourceNotFoundError("Activity a ser Atualizado"));

    const updatedActivity = await this.repository.update(nome, updatedDate) as ActivityType;

    return right({ updatedActivity });
  }
}
