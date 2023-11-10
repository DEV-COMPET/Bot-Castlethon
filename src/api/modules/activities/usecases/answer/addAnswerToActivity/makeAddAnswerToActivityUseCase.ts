import { AddAnswerToActivityUseCase } from "./addAnswerToActivityUseCase"
import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"
import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"

export function makeAddAnswerToActivityUseCase() {
    const answersRepository = new AnswerMongoDBRepository()
    const activitiesRepository = new ActivityMongoDBRepository()
    const useCase = new AddAnswerToActivityUseCase(answersRepository, activitiesRepository)

    return useCase
}