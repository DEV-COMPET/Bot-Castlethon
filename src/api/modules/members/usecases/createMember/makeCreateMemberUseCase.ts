import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { CreateMemberUseCase } from "./createMemberUseCase"

export function makeCreateMemberUseCase() {
    const usersRepository = new MemberMongoDBRepository()
    const useCase = new CreateMemberUseCase(usersRepository)

    return useCase
}