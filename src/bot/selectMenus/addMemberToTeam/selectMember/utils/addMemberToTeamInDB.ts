import { Either, left, right } from "@/api/@types/either";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { createURL } from "@/bot/utils/fetch/url";

interface AddMemberToTeamInDBRequest {
    memberName: string
    teamName: string
}

type AddMemberToTeamInDBResponse = Either<
    { error: FetchReponseError },
    { memberName: string }
>

export async function addMemberToTeamInDB({ memberName, teamName }: AddMemberToTeamInDBRequest): Promise<AddMemberToTeamInDBResponse> {
    /*
    const body = JSON.stringify({
        teamName: teamName,
        memberName: memberName
    })

    const requestOptions = {
        method: "post", body,
        headers: { "Content-Type": "application/json" },
    };

    const APIUrl = createURL(`/team/addmember/`)

    const response = await fetch(APIUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }
    */

    return right({ memberName })
}