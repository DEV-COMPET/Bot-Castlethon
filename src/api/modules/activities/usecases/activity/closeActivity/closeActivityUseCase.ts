import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { ActivityRepository as InterfaceCloseActivityRepository } from "../../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";

interface CloseActivityUseCaseRequest {
  name: string,
}

type CloseActivityUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { name: string }
>

export class CloseActivityUseCase {
  constructor(private readonly repository: InterfaceCloseActivityRepository) { }

  async execute({ name }: CloseActivityUseCaseRequest): Promise<CloseActivityUseCaseResponse> {

    const activityExists = await this.repository.getByName(name);
    if (!activityExists)
      return left(new ResourceNotFoundError("Activity"))

    await this.repository.close(name);

    return right({ name });
  }
}
