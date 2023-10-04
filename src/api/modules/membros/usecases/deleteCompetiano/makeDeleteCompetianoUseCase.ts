import { CompetianoMongoDBRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository"
import { DeleteCompetianoUseCase } from "./deleteCompetianoUseCase"

export function makeDeleteCompetianoUseCase() {
    const usersRepository = new CompetianoMongoDBRepository()
    const useCase = new DeleteCompetianoUseCase(usersRepository)

    return useCase
}