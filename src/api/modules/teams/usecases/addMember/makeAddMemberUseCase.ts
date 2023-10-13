import { MemberMongoDBRepository } from "@/api/modules/members/repositories/defaultMongoDBRepository/memberRepository"
import { TeamMongoDBRepository } from "../../repositories/defaultMongoDBRepository/teamRepository"
import { AddMemberUseCase } from "./addMemberUseCase"

export function makeAddMemberUseCase() {
    const teamsRepository = new TeamMongoDBRepository()
    const membersRepository = new MemberMongoDBRepository()
    const useCase = new AddMemberUseCase(teamsRepository, membersRepository)

    return useCase
}