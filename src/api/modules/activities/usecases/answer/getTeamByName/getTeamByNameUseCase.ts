import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { AnswerRepository as InterfaceAnswerRepository } from "../../../repositories";
import { AnswerType } from "../../../entities/answer.entity";

interface GetAnswerByNameUseCaseRequest {
    name: string
}

type GetAnswerByNameUseCaseResponse = Either<
    ResourceNotFoundError,
    { answer: AnswerType }
>

export class GetAnswerByNameUseCase {

    constructor(private readonly repository: InterfaceAnswerRepository) { }

    async execute({ name }: GetAnswerByNameUseCaseRequest): Promise<GetAnswerByNameUseCaseResponse> {
        const answer = await this.repository.getByName(name);

        if (!answer)
            return left(new ResourceNotFoundError("Answer"))

        return right({ answer });
    }
}
