import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { MemberRepository as InterfaceCreateMemberRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Member } from "../../entities/member.entity";
import { TeamRepository } from "@/api/modules/teams/repositories";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";

interface CreateMemberUseCaseRequest {
  name: string,
  profile_picture?: string,
  email: string,
  role: string,
  institution: string,
  teamName?: string,
  discord_id: string,
  discord_username: string
  discord_nickname?: string
}

type CreateMemberUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { member: Member }
>

export class CreateMemberUseCase {
  constructor(private readonly repository: InterfaceCreateMemberRepository,
    private teamRepository: TeamRepository) { }

  async execute({ email, institution, name, role, profile_picture, teamName, discord_id, discord_username, discord_nickname }: CreateMemberUseCaseRequest): Promise<CreateMemberUseCaseResponse> {

    const memberExists = await this.repository.getByName(name);

    if (memberExists)
      return left(new ResourceAlreadyExistsError("Member"))

    const member = new Member({
      email, institution, name, role, profile_picture, teamName, created_at: new Date(), updated_at: new Date(),
      discord_id, discord_username, discord_nickname
    });

    await this.repository.create(member);

    if (teamName) {
      const teamExists = await this.teamRepository.getByName(teamName)

      if (!teamExists)
        return left(new ResourceNotFoundError("Team for new Member"))

      teamExists.members ??= [];
      teamExists.members.push(member._data);

      await this.teamRepository.update(teamName, teamExists)

    }
    return right({ member });
  }
}
