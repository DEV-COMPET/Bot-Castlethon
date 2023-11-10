import { TeamMongoDBRepository } from "@/api/modules/teams/repositories/defaultMongoDBRepository/teamRepository"
import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"
import { CreateAnswerUseCase } from "./createAnswerUseCase"
import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"

export function makeCreateAnswerUseCase() {
    const answersRepository = new AnswerMongoDBRepository()
    const teamsRepository = new TeamMongoDBRepository()
    const activityRepository = new ActivityMongoDBRepository()
    const useCase = new CreateAnswerUseCase(answersRepository, teamsRepository, activityRepository)

    return useCase
}