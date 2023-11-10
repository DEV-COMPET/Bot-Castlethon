import { Either, right } from "@/api/@types/either";
import { ActivityRepository as InterfaceActivityRepository } from "../../../repositories";
import { ActivityType } from "../../../entities/activity.entity";

type ListActivityUseCaseResponse = Either<
  null,
  { activitys: ActivityType[] }
>

export class ListActivityUseCase {

  constructor(private readonly repository: InterfaceActivityRepository) { }

  async execute(): Promise<ListActivityUseCaseResponse> {
    const activitys = await this.repository.list();
    return right({ activitys });
  }
}
