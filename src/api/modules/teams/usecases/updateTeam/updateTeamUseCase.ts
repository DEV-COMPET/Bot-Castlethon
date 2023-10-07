import { TeamRepository } from "../../repositories";
import { TeamType } from "../../entities/team.entity";
import { TeamData } from "../../repositories/defaultMongoDBRepository/teamRepository";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"

interface UpdateTeamUseCaseRequest {
  nome: string
  updatedDate: TeamData
}

type UpdateTeamUseCaseResponse = Either<
  ResourceNotFoundError,
  { updatedTeam: TeamType }
>

export class UpdateTeamUseCase {

  constructor(private repository: TeamRepository) { }

  async execute({ nome, updatedDate }: UpdateTeamUseCaseRequest): Promise<UpdateTeamUseCaseResponse> {
    const team = await this.repository.getByName(nome);

    if (!team)
      return left(new ResourceNotFoundError("Team a ser Atualizado"));

    const updatedTeam = await this.repository.update(nome, updatedDate) as TeamType;

    return right({ updatedTeam });
  }
}
