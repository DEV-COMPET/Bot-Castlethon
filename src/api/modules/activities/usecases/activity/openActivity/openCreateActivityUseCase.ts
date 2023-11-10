import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"
import { OpenActivityUseCase } from "./openActivityUseCase"

export function makeOpenActivityUseCase() {
    const usersRepository = new ActivityMongoDBRepository()
    const useCase = new OpenActivityUseCase(usersRepository)

    return useCase
}