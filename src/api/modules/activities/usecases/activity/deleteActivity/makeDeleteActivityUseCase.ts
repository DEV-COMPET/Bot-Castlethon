import { DeleteActivityUseCase } from "./deleteActivityUseCase"
import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"
import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"

export function makeDeleteActivityUseCase() {
    const activitysRepository = new ActivityMongoDBRepository()
    const answerRepository = new AnswerMongoDBRepository()
    const useCase = new DeleteActivityUseCase(activitysRepository, answerRepository)

    return useCase
}