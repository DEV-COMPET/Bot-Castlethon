import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"
import { ListActivityUseCase } from "./listActivityUseCase"

export function makeListActivityUseCase() {
    const usersRepository = new ActivityMongoDBRepository()
    const useCase = new ListActivityUseCase(usersRepository)

    return useCase
}