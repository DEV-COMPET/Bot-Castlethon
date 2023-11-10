import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"
import { CreateAnswerUseCase } from "./createAnswerUseCase"

export function makeCreateAnswerUseCase() {
    const usersRepository = new AnswerMongoDBRepository()
    const useCase = new CreateAnswerUseCase(usersRepository)

    return useCase
}