import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"
import { CloseActivityUseCase } from "./closeActivityUseCase"

export function makeCloseActivityUseCase() {
    const usersRepository = new ActivityMongoDBRepository()
    const useCase = new CloseActivityUseCase(usersRepository)

    return useCase
}