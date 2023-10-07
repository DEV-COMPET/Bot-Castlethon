import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { TeamType } from "../../entities/team.entity";
import { TeamRepository as InterfaceTeamRepository } from "../../repositories";

interface GetTeamByNameUseCaseRequest {
    name: string
}

type GetTeamByNameUseCaseResponse = Either<
    ResourceNotFoundError,
    { team: TeamType }
>


export class GetTeamByNameUseCase {

    constructor(private readonly repository: InterfaceTeamRepository) { }

    async execute({ name }: GetTeamByNameUseCaseRequest): Promise<GetTeamByNameUseCaseResponse> {
        const team = await this.repository.getByName(name);

        if (!team)
            return left(new ResourceNotFoundError("Team"))

        return right({team});
    }
}
