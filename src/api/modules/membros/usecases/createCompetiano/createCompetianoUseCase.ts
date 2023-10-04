import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { CompetianoRepository as InterfaceCreateCompetianoRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Competiano } from "../../entities/competiano.entity";

interface CreateCompetianoUseCaseRequest {
    nome: string;
    email: string;
    data_inicio: Date;
    url_imagem?: string;
    linkedin?: string;
    lates?: string;
}

type CreateCompetianoUseCaseResponse = Either<
    ResourceAlreadyExistsError,
    { competiano: Competiano }
>

export class CreateCompetianoUseCase  {
  constructor(private readonly repository: InterfaceCreateCompetianoRepository) {}
  
  async execute({ nome, email, data_inicio, url_imagem, linkedin, lates }: CreateCompetianoUseCaseRequest): Promise<CreateCompetianoUseCaseResponse> {
    
    const competianoExists = await this.repository.getByName(nome);
    
    if (competianoExists) 
        return left(new ResourceAlreadyExistsError("Competiano"))
    

    const competiano = new Competiano({
        data_inicio, email, nome, url_imagem, linkedin, lates, 
    });

    await this.repository.create(competiano);
    
    return right({competiano});
  }
}
