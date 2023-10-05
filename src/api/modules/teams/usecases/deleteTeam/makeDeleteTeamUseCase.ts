import { TeamMongoDBRepository } from "../../repositories/defaultMongoDBRepository/teamRepository"
import { DeleteTeamUseCase } from "./deleteTeamUseCase"

export function makeDeleteTeamUseCase() {
    const teamsRepository = new TeamMongoDBRepository()
    const useCase = new DeleteTeamUseCase(teamsRepository)

    return useCase
}