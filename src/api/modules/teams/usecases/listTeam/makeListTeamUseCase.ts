import { TeamMongoDBRepository } from "../../repositories/defaultMongoDBRepository/teamRepository"
import { ListTeamUseCase } from "./listTeamUseCase"

export function makeListTeamUseCase() {
    const usersRepository = new TeamMongoDBRepository()
    const useCase = new ListTeamUseCase(usersRepository)

    return useCase
}