import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { MemberRepository as InterfaceCreateMemberRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Member } from "../../entities/member.entity";

interface CreateMemberUseCaseRequest {
  name: string,
  profile_picture?: string,
  email: string,
  role: string,
  institution: string,
  teamId?: string,
}

type CreateMemberUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { member: Member }
>

export class CreateMemberUseCase {
  constructor(private readonly repository: InterfaceCreateMemberRepository) { }

  async execute({ email, institution, name, role, profile_picture, teamId, }: CreateMemberUseCaseRequest): Promise<CreateMemberUseCaseResponse> {

    const memberExists = await this.repository.getByName(name);

    if (memberExists)
      return left(new ResourceAlreadyExistsError("Member"))


    const member = new Member({
      email, institution, name, role, profile_picture, teamId,
    });

    await this.repository.create(member);

    return right({ member });
  }
}
