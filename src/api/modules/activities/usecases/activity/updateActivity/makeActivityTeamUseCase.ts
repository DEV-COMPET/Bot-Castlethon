import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"
import { UpdateActivityUseCase } from "./updateActivityUseCase"

export function makeUpdateActivityUseCase() {
    const usersRepository = new ActivityMongoDBRepository()
    const useCase = new UpdateActivityUseCase(usersRepository)

    return useCase
}