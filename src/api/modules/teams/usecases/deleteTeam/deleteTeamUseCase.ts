import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { TeamType } from "../../entities/team.entity";
import type { TeamRepository as InterfaceDeleteTeamRepository } from "../../repositories";

interface DeleteTeamUseCaseRequest {
  name: string;
}

type DeleteTeamUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedTeam: TeamType }
>

export class DeleteTeamUseCase {

  constructor(private repository: InterfaceDeleteTeamRepository) {}
  
  async execute({ name }: DeleteTeamUseCaseRequest): Promise<DeleteTeamUseCaseResponse> {

    const deletedTeam = await this.repository.deleteByName(name);

    if (!deletedTeam) 
      return left(new ResourceNotFoundError("Team"));
    
    return right({ deletedTeam });
  }
}
