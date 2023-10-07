import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { DeleteMemberUseCase } from "./deleteMemberUseCase"

export function makeDeleteMemberUseCase() {
    const membersRepository = new MemberMongoDBRepository()
    const useCase = new DeleteMemberUseCase(membersRepository)

    return useCase
}