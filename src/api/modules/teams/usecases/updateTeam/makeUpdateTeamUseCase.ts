import { TeamMongoDBRepository } from "../../repositories/defaultMongoDBRepository/teamRepository"
import { UpdateTeamUseCase } from "./updateTeamUseCase"

export function makeUpdateTeamUseCase() {
    const usersRepository = new TeamMongoDBRepository()
    const useCase = new UpdateTeamUseCase(usersRepository)

    return useCase
}