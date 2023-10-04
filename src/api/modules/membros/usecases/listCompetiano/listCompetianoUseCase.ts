import { Either, right } from "@/api/@types/either";
import { CompetianoType } from "../../entities/competiano.entity";
import { CompetianoRepository as InterfaceCompetianoRepository } from "../../repositories";

type ListCompetianoUseCaseResponse = Either<
    null,
    { competianos: CompetianoType[] }
>

export class ListCompetianoUseCase {

    constructor(private readonly repository: InterfaceCompetianoRepository) {}

    async execute(): Promise<ListCompetianoUseCaseResponse> {
      const competianos = await this.repository.list();
      return right({competianos});
    }
  }
