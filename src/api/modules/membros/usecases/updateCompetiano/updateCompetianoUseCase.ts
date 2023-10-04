import { CompetianoRepository } from "../../repositories";
import { CompetianoType } from "../../entities/competiano.entity";
import { MemberData } from "../../repositories/defaultMongoDBRepository/competianoRepository";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"

interface UpdateCompetianoUseCaseRequest {
    nome: string
    updatedDate: MemberData
}
  
type UpdateCompetianoUseCaseResponse = Either<
    ResourceNotFoundError,
    { updatedMember: CompetianoType }
>

export class UpdateCompetianoUseCase {

  constructor(private repository: CompetianoRepository) {}
  
  async execute({nome, updatedDate}: UpdateCompetianoUseCaseRequest): Promise<UpdateCompetianoUseCaseResponse> {
    const member = await this.repository.getByName(nome);
    
    if (!member) 
      return left(new ResourceNotFoundError("Competiano a ser Atualizado"));

    const updatedMember = await this.repository.update(nome, updatedDate) as CompetianoType;

    return right({ updatedMember });
  }
}
