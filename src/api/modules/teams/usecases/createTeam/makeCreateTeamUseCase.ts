import { TeamMongoDBRepository } from "../../repositories/defaultMongoDBRepository/teamRepository"
import { CreateTeamUseCase } from "./createTeamUseCase"

export function makeCreateTeamUseCase() {
    const usersRepository = new TeamMongoDBRepository()
    const useCase = new CreateTeamUseCase(usersRepository)

    return useCase
}