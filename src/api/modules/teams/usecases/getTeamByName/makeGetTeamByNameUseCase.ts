import { TeamMongoDBRepository } from "../../repositories/defaultMongoDBRepository/teamRepository"
import { GetTeamByNameUseCase } from "./getTeamByNameUseCase"

export function makeGetTeamByNameUseCase() {
    const usersRepository = new TeamMongoDBRepository()
    const useCase = new GetTeamByNameUseCase(usersRepository)

    return useCase
}