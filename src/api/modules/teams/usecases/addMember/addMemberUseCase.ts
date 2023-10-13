import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import type { TeamRepository as InterfaceAddMemberRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import { MemberRepository } from "@/api/modules/members/repositories";

interface AddMemberUseCaseRequest {
	memberDiscordId: string,
	teamName: string
}

type AddMemberUseCaseResponse = Either<
  ResourceNotFoundError | ResourceAlreadyExistsError,
  { memberName: string }
>

export class AddMemberUseCase {
  constructor(private repository: InterfaceAddMemberRepository,
              private membersRepository: MemberRepository) { }

  async execute({ memberDiscordId, teamName }: AddMemberUseCaseRequest): Promise<AddMemberUseCaseResponse> {

    const teamExists = await this.repository.getByName(teamName);
    if (!teamExists)
      return left(new ResourceNotFoundError("Team"))

    const memberExists = await this.membersRepository.getByDiscordId(memberDiscordId)
    if (!memberExists)
      return left(new ResourceNotFoundError("Member"))

    const memberAlreadyAdded = await teamExists.members?.findIndex(member => member.discord_id === memberDiscordId)
    if(memberAlreadyAdded !== -1)
      return left(new ResourceAlreadyExistsError("Member"))

    teamExists.members?.push(memberExists)

    await this.repository.update(teamName, teamExists);

    return right({ memberName: memberExists.name });
  }
}
