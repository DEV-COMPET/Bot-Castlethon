import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"
import { AnswerData } from "../../../repositories/defaultMongoDBRepository/answerRepository";
import { AnswerType } from "../../../entities/answer.entity";
import { AnswerRepository } from "../../../repositories";

interface UpdateAnswerUseCaseRequest {
  nome: string
  updatedDate: AnswerData
}

type UpdateAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  { updatedAnswer: AnswerType }
>

export class UpdateAnswerUseCase {

  constructor(private repository: AnswerRepository) { }

  async execute({ nome, updatedDate }: UpdateAnswerUseCaseRequest): Promise<UpdateAnswerUseCaseResponse> {
    const answer = await this.repository.getByName(nome);

    if (!answer)
      return left(new ResourceNotFoundError("Answer a ser Atualizado"));

    const updatedAnswer = await this.repository.update(nome, updatedDate) as AnswerType;

    return right({ updatedAnswer });
  }
}
