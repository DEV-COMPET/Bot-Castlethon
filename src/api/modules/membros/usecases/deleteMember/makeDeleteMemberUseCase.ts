import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { DeleteMemberUseCase } from "./deleteMemberUseCase"

export function makeDeleteMemberUseCase() {
    const usersRepository = new MemberMongoDBRepository()
    const useCase = new DeleteMemberUseCase(usersRepository)

    return useCase
}