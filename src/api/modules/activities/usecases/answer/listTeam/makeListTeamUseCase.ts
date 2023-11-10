import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"
import { ListAnswerUseCase } from "./listTeamUseCase"

export function makeListAnswerUseCase() {
    const usersRepository = new AnswerMongoDBRepository()
    const useCase = new ListAnswerUseCase(usersRepository)

    return useCase
}