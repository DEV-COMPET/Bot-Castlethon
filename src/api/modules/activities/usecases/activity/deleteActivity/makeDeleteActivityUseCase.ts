import { MemberMongoDBRepository } from "@/api/modules/members/repositories/defaultMongoDBRepository/memberRepository"
import { DeleteActivityUseCase } from "./deleteActivityUseCase"
import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"

export function makeDeleteActivityUseCase() {
    const activitysRepository = new ActivityMongoDBRepository()
    const membersRepository = new MemberMongoDBRepository()
    const useCase = new DeleteActivityUseCase(activitysRepository, membersRepository)

    return useCase
}