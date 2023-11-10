import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"
import { UpdateAnswerUseCase } from "./updateTeamUseCase"

export function makeUpdateAnswerUseCase() {
    const usersRepository = new AnswerMongoDBRepository()
    const useCase = new UpdateAnswerUseCase(usersRepository)

    return useCase
}