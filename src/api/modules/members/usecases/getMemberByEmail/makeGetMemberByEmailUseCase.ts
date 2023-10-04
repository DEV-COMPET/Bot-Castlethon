import { MemberMongoDBRepository } from "../../repositories/defaultMongoDBRepository/memberRepository"
import { GetMemberByEmailUseCase } from "./getMemberByEmailUseCase"

export function makeGetMemberByEmailUseCase() {
    const usersRepository = new MemberMongoDBRepository()
    const useCase = new GetMemberByEmailUseCase(usersRepository)

    return useCase
}