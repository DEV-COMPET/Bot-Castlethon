import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { TeamRepository as InterfaceCreateTeamRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Team } from "../../entities/team.entity";
import { MemberType } from "@/api/modules/members/entities/member.entity";

interface CreateTeamUseCaseRequest {
  name: string,
  profile_picture?: string,
  members?: MemberType[],
  institution: string,
}

type CreateTeamUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { team: Team }
>

export class CreateTeamUseCase {
  constructor(private readonly repository: InterfaceCreateTeamRepository) { }

  async execute({ institution, members, name, profile_picture, }: CreateTeamUseCaseRequest): Promise<CreateTeamUseCaseResponse> {

    const teamExists = await this.repository.getByName(name);

    if (teamExists)
      return left(new ResourceAlreadyExistsError("Team"))

    const team = new Team({ institution, members, name, profile_picture, created_at: new Date(), updated_at: new Date() });

    await this.repository.create(team);

    return right({ team });
  }
}
