import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { TeamType } from "../../entities/team.entity";
import type { TeamRepository as InterfaceDeleteTeamRepository } from "../../repositories";
import { MemberRepository } from "@/api/modules/members/repositories";

interface DeleteTeamUseCaseRequest {
  name: string;
}

type DeleteTeamUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedTeam: TeamType }
>

export class DeleteTeamUseCase {

  constructor(private repository: InterfaceDeleteTeamRepository,
    private membersRepository: MemberRepository
  ) { }

  async execute({ name }: DeleteTeamUseCaseRequest): Promise<DeleteTeamUseCaseResponse> {

    const team = await this.repository.getByName(name);
    
    if (!team)
      return left(new ResourceNotFoundError("Team"));

    const memberNames = team.members?.map(member => member.name);
    if (memberNames) {

      memberNames.forEach(async (memberName) => {
        const member = await this.membersRepository.getByName(memberName);
        if (member) {
          const updatedMember = { ...member, teamName: "" };

          await this.membersRepository.update(memberName, updatedMember);
        }
      })
    }

    const deletedTeam = await this.repository.deleteByName(name);

    if (!deletedTeam)
      return left(new ResourceNotFoundError("Team"));

    return right({ deletedTeam });
  }
}
