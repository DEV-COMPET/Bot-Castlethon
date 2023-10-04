import { CompetianoMongoDBRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository"
import { CreateCompetianoUseCase } from "./createCompetianoUseCase"

export function makeCreateCompetianoUseCase() {
    const usersRepository = new CompetianoMongoDBRepository()
    const useCase = new CreateCompetianoUseCase(usersRepository)

    return useCase
}