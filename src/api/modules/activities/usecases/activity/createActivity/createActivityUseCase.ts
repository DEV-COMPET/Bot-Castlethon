import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { ActivityRepository as InterfaceCreateActivityRepository } from "../../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Activity } from "../../../entities/activity.entity";

interface CreateActivityUseCaseRequest {
  name: string,
  description?: string,
  descriptionFileDir?: string,
}

type CreateActivityUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { activity: Activity }
>

export class CreateActivityUseCase {
  constructor(private readonly repository: InterfaceCreateActivityRepository) { }

  async execute({ name, description, descriptionFileDir }: CreateActivityUseCaseRequest): Promise<CreateActivityUseCaseResponse> {

    const activityExists = await this.repository.getByName(name);

    if (activityExists)
      return left(new ResourceAlreadyExistsError("Activity"))

    const activity = new Activity({ name, description, descriptionFileDir, closed_at: null, opened_at: null, chatMessagesIds: [] });

    await this.repository.create(activity);

    return right({ activity });
  }
}
