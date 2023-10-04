import { Either, right } from "@/api/@types/either";
import { MemberType } from "../../entities/member.entity";
import { MemberRepository as InterfaceMemberRepository } from "../../repositories";

type ListMemberUseCaseResponse = Either<
    null,
    { members: MemberType[] }
>

export class ListMemberUseCase {

    constructor(private readonly repository: InterfaceMemberRepository) {}

    async execute(): Promise<ListMemberUseCaseResponse> {
      const members = await this.repository.list();
      return right({members});
    }
  }
