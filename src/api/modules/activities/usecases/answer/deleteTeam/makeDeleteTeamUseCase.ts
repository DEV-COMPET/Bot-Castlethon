import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"
import { DeleteAnswerUseCase } from "./deleteTeamUseCase"

export function makeDeleteAnswerUseCase() {
    const answersRepository = new AnswerMongoDBRepository()
    const useCase = new DeleteAnswerUseCase(answersRepository)

    return useCase
}