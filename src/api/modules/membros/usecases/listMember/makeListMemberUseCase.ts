import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { ListMemberUseCase } from "./listMemberUseCase"

export function makeListMemberUseCase() {
    const usersRepository = new MemberMongoDBRepository()
    const useCase = new ListMemberUseCase(usersRepository)

    return useCase
}