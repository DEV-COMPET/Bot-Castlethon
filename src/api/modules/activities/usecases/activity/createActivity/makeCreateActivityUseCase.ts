import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"
import { CreateActivityUseCase } from "./createActivityUseCase"

export function makeCreateActivityUseCase() {
    const usersRepository = new ActivityMongoDBRepository()
    const useCase = new CreateActivityUseCase(usersRepository)

    return useCase
}