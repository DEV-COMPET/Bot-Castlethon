import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { CreateMemberUseCase } from "./createMemberUseCase"

export function makeCreateMemberUseCase() {
    const membersRepository = new MemberMongoDBRepository()
    const useCase = new CreateMemberUseCase(membersRepository)

    return useCase
}