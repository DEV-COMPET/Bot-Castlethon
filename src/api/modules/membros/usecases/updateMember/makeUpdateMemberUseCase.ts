import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { UpdateMemberUseCase } from "./updateMemberUseCase"

export function makeUpdateMemberUseCase() {
    const usersRepository = new MemberMongoDBRepository()
    const useCase = new UpdateMemberUseCase(usersRepository)

    return useCase
}