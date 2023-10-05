import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { ListMemberUseCase } from "./listMemberUseCase"

export function makeListMemberUseCase() {
    const membersRepository = new MemberMongoDBRepository()
    const useCase = new ListMemberUseCase(membersRepository)

    return useCase
}