import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { ActivityRepository as InterfaceOpenActivityRepository } from "../../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";

interface OpenActivityUseCaseRequest {
  name: string,
}

type OpenActivityUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { name: string }
>

export class OpenActivityUseCase {
  constructor(private readonly repository: InterfaceOpenActivityRepository) { }

  async execute({ name }: OpenActivityUseCaseRequest): Promise<OpenActivityUseCaseResponse> {

    const activityExists = await this.repository.getByName(name);
    if (!activityExists)
      return left(new ResourceNotFoundError("Activity"))

    await this.repository.open(name);

    return right({ name });
  }
}
