import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ActivityRepository as InterfaceActivityRepository } from "../../../repositories";
import { ActivityType } from "../../../entities/activity.entity";

interface GetActivityByNameUseCaseRequest {
    name: string
}

type GetActivityByNameUseCaseResponse = Either<
    ResourceNotFoundError,
    { activity: ActivityType }
>

export class GetActivityByNameUseCase {

    constructor(private readonly repository: InterfaceActivityRepository) { }

    async execute({ name }: GetActivityByNameUseCaseRequest): Promise<GetActivityByNameUseCaseResponse> {
        const activity = await this.repository.getByName(name);

        if (!activity)
            return left(new ResourceNotFoundError("Activity"))

        return right({ activity });
    }
}
