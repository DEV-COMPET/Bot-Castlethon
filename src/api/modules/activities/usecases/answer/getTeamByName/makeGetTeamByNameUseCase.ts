import { AnswerMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/answerRepository"
import { GetAnswerByNameUseCase } from "./getTeamByNameUseCase"

export function makeGetAnswerByNameUseCase() {
    const usersRepository = new AnswerMongoDBRepository()
    const useCase = new GetAnswerByNameUseCase(usersRepository)

    return useCase
}