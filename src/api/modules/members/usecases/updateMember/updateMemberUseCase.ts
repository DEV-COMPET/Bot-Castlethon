import { MemberRepository } from "../../repositories";
import { MemberType } from "../../entities/member.entity";
import { MemberData } from "../../repositories/defaultMongoDBRepository/memberRepository";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"

interface UpdateMemberUseCaseRequest {
    nome: string
    updatedDate: MemberData
}
  
type UpdateMemberUseCaseResponse = Either<
    ResourceNotFoundError,
    { updatedMember: MemberType }
>

export class UpdateMemberUseCase {

  constructor(private repository: MemberRepository) {}
  
  async execute({nome, updatedDate}: UpdateMemberUseCaseRequest): Promise<UpdateMemberUseCaseResponse> {
    const member = await this.repository.getByName(nome);
    
    if (!member) 
      return left(new ResourceNotFoundError("Member a ser Atualizado"));

    const updatedMember = await this.repository.update(nome, updatedDate) as MemberType;

    return right({ updatedMember });
  }
}
