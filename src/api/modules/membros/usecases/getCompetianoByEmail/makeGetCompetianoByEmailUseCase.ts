import { CompetianoMongoDBRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository"
import { GetCompetianoByEmailUseCase } from "./getCompetianoByEmailUseCase"

export function makeGetCompetianoByEmailUseCase() {
    const usersRepository = new CompetianoMongoDBRepository()
    const useCase = new GetCompetianoByEmailUseCase(usersRepository)

    return useCase
}