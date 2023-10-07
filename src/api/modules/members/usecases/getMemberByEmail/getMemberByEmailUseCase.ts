import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { MemberType } from "../../entities/member.entity";
import { MemberRepository as InterfaceMemberRepository } from "../../repositories";

interface GetMemberByEmailUseCaseRequest {
    email: string
}

type GetMemberByEmailUseCaseResponse = Either<
    ResourceNotFoundError,
    { member: MemberType }
>


export class GetMemberByEmailUseCase {

    constructor(private readonly repository: InterfaceMemberRepository) { }

    async execute({ email }: GetMemberByEmailUseCaseRequest): Promise<GetMemberByEmailUseCaseResponse> {
        const member = await this.repository.getByEmail(email);

        if (!member)
            return left(new ResourceNotFoundError("Member"))

        return right({member});
    }
}
