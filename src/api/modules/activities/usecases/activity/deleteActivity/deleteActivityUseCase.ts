import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import type { ActivityRepository as InterfaceDeleteActivityRepository } from "../../../repositories";
import { MemberRepository } from "@/api/modules/members/repositories";
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
    private membersRepository: MemberRepository
  ) { }

  async execute({ name }: DeleteActivityUseCaseRequest): Promise<DeleteActivityUseCaseResponse> {

    const deletedActivity = await this.repository.deleteByName(name);

    if (!deletedActivity)
      return left(new ResourceNotFoundError("Activity"));

    return right({ deletedActivity });
  }
}
