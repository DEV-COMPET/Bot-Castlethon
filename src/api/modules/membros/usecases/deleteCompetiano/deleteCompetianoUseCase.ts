import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { CompetianoType } from "../../entities/competiano.entity";
import type { CompetianoRepository as InterfaceDeleteCompetianoRepository } from "../../repositories";

interface DeleteCompetianoUseCaseRequest {
  nome: string;
}

type DeleteCompetianoUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedMember: CompetianoType }
>

export class DeleteCompetianoUseCase {

  constructor(private repository: InterfaceDeleteCompetianoRepository) {}
  
  async execute({ nome }: DeleteCompetianoUseCaseRequest): Promise<DeleteCompetianoUseCaseResponse> {

    const deletedMember = await this.repository.deleteByName(nome);

    if (!deletedMember) 
      return left(new ResourceNotFoundError("User"));
    
    return right({ deletedMember });
  }
}
