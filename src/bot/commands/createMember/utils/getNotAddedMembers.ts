import { Either, left, right } from "@/api/@types/either";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { createURL } from "@/bot/utils/fetch/url";
import { MemberData } from "../createMember";
import { MemberType } from "@/api/modules/members/entities/member.entity";

interface GetNotAddedMembersRequest {
    membersData: MemberData[]
}

type GetNotAddedMembersResponse = Either<
    { error: FetchReponseError },
    { addableMembers: MemberData[] }
>

export async function getNotAddedMembers({ membersData }: GetNotAddedMembersRequest): Promise<GetNotAddedMembersResponse> {

    const requestOptions = {
        method: "get",
        headers: { "Content-Type": "application/json" },
    };

    const APIUrl = createURL("/member/")

    const response = await fetch(APIUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const addedMembers: MemberType[] = await response.json();

    console.dir({ addedMembers })


    const addableMembers = membersData.filter(memberData => memberData.id !== addedMembers.find(addedMember => addedMember.discord_id === memberData.id)?.discord_id);

    console.dir({ addableMembers })

    return right({ addableMembers })

}