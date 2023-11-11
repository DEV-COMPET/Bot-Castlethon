import { ActivityMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/activityRepository"
import { AddActivityMessageUseCase } from "./addActivityMessageUseCase"

export function makeAddActivityMessageUseCase() {
    const usersRepository = new ActivityMongoDBRepository()
    const useCase = new AddActivityMessageUseCase(usersRepository)

    return useCase
}