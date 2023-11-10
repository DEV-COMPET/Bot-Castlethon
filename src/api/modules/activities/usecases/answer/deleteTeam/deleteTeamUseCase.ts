import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import type { AnswerRepository as InterfaceDeleteAnswerRepository } from "../../../repositories";
import { AnswerType } from "../../../entities/answer.entity";

interface DeleteAnswerUseCaseRequest {
  name: string;
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedAnswer: AnswerType }
>

export class DeleteAnswerUseCase {

  constructor(private repository: InterfaceDeleteAnswerRepository,
  ) { }

  async execute({ name }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {

    const deletedAnswer = await this.repository.deleteByName(name);

    if (!deletedAnswer)
      return left(new ResourceNotFoundError("Answer"));

    return right({ deletedAnswer });
  }
}
