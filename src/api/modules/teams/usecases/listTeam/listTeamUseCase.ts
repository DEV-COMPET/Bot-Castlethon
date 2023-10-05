import { Either, right } from "@/api/@types/either";
import { TeamType } from "../../entities/team.entity";
import { TeamRepository as InterfaceTeamRepository } from "../../repositories";

type ListTeamUseCaseResponse = Either<
    null,
    { teams: TeamType[] }
>

export class ListTeamUseCase {

    constructor(private readonly repository: InterfaceTeamRepository) {}

    async execute(): Promise<ListTeamUseCaseResponse> {
      const teams = await this.repository.list();
      return right({teams});
    }
  }
