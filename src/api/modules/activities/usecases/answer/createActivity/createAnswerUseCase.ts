import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { AnswerRepository as InterfaceCreateAnswerRepository } from "../../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Answer } from "../../../entities/answer.entity";

interface CreateAnswerUseCaseRequest {
  teamName: string,
  answerText?: string,
  answerDir?: string,
}

type CreateAnswerUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { answer: Answer }
>

export class CreateAnswerUseCase {
  constructor(private readonly repository: InterfaceCreateAnswerRepository) { }

  async execute({ teamName, answerDir, answerText }: CreateAnswerUseCaseRequest): Promise<CreateAnswerUseCaseResponse> {

    const answerExists = await this.repository.getByName(teamName);

    if (answerExists)
      return left(new ResourceAlreadyExistsError("Answer"))

    const answer = new Answer({ teamName, answerDir, answerText });

    await this.repository.create(answer);

    return right({ answer });
  }
}
