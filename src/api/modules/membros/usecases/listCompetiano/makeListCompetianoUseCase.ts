import { CompetianoMongoDBRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository"
import { ListCompetianoUseCase } from "./listCompetianoUseCase"

export function makeListCompetianoUseCase() {
    const usersRepository = new CompetianoMongoDBRepository()
    const useCase = new ListCompetianoUseCase(usersRepository)

    return useCase
}