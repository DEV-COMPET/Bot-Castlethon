import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"
import { DeleteAnswerUseCase } from "./deleteTeamUseCase"
import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"

export function makeDeleteAnswerUseCase() {
    const answersRepository = new AnswerMongoDBRepository()
    const activityRepository = new ActivityMongoDBRepository()
    const useCase = new DeleteAnswerUseCase(answersRepository, activityRepository)

    return useCase
}