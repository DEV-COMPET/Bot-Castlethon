import { Either, right } from "@/api/@types/either";
import { AnswerRepository as InterfaceAnswerRepository } from "../../../repositories";
import { AnswerType } from "../../../entities/answer.entity";

type ListAnswerUseCaseResponse = Either<
  null,
  { answers: AnswerType[] }
>

export class ListAnswerUseCase {

  constructor(private readonly repository: InterfaceAnswerRepository) { }

  async execute(): Promise<ListAnswerUseCaseResponse> {
    const answers = await this.repository.list();
    return right({ answers });
  }
}
