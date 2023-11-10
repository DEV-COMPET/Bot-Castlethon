import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"
import { GetActivityByNameUseCase } from "./getTeamByNameUseCase"

export function makeGetActivityByNameUseCase() {
    const usersRepository = new ActivityMongoDBRepository()
    const useCase = new GetActivityByNameUseCase(usersRepository)

    return useCase
}