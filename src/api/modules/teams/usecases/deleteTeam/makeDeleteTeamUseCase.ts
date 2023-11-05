import { MemberMongoDBRepository } from "@/api/modules/members/repositories/defaultMongoDBRepository/memberRepository"
import { TeamMongoDBRepository } from "../../repositories/defaultMongoDBRepository/teamRepository"
import { DeleteTeamUseCase } from "./deleteTeamUseCase"

export function makeDeleteTeamUseCase() {
    const teamsRepository = new TeamMongoDBRepository()
    const membersRepository = new MemberMongoDBRepository()
    const useCase = new DeleteTeamUseCase(teamsRepository, membersRepository)

    return useCase
}