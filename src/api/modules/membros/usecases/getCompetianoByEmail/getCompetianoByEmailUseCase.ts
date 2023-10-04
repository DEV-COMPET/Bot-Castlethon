import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { CompetianoType } from "../../entities/competiano.entity";
import { CompetianoRepository as InterfaceCompetianoRepository } from "../../repositories";

interface GetCompetianoByEmailUseCaseRequest {
    email: string
}

type GetCompetianoByEmailUseCaseResponse = Either<
    ResourceNotFoundError,
    { competiano: CompetianoType }
>


export class GetCompetianoByEmailUseCase {

    constructor(private readonly repository: InterfaceCompetianoRepository) { }

    async execute({ email }: GetCompetianoByEmailUseCaseRequest): Promise<GetCompetianoByEmailUseCaseResponse> {
        const competiano = await this.repository.getByEmail(email);

        if (!competiano)
            return left(new ResourceNotFoundError("Competiano"))

        return right({competiano});
    }
}
