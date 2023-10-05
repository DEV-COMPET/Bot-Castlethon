import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { UpdateMemberUseCase } from "./updateMemberUseCase"

export function makeUpdateMemberUseCase() {
    const membersRepository = new MemberMongoDBRepository()
    const useCase = new UpdateMemberUseCase(membersRepository)

    return useCase
}