import { TeamMongoDBRepository } from "@/api/modules/teams/repositories/defaultMongoDBRepository/teamRepository"
import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { CreateMemberUseCase } from "./createMemberUseCase"

export function makeCreateMemberUseCase() {
    const membersRepository = new MemberMongoDBRepository()
    const teamsRepository = new TeamMongoDBRepository()
    const useCase = new CreateMemberUseCase(membersRepository, teamsRepository)

    return useCase
}