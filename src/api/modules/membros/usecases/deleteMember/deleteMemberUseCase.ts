import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { MemberType } from "../../entities/member.entity";
import type { MemberRepository as InterfaceDeleteMemberRepository } from "../../repositories";

interface DeleteMemberUseCaseRequest {
  name: string;
}

type DeleteMemberUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedMember: MemberType }
>

export class DeleteMemberUseCase {

  constructor(private repository: InterfaceDeleteMemberRepository) {}
  
  async execute({ name }: DeleteMemberUseCaseRequest): Promise<DeleteMemberUseCaseResponse> {

    const deletedMember = await this.repository.deleteByName(name);

    if (!deletedMember) 
      return left(new ResourceNotFoundError("User"));
    
    return right({ deletedMember });
  }
}
