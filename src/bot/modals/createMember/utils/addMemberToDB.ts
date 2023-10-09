import { createURL } from "@/bot/utils/fetch/url";
import { ExtractInputDataResponse } from "./extractInputData";
import { Member } from "@/api/modules/members/entities/member.entity";
import { Either, left, right } from "@/api/@types/either";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";

export type AddMemberToDBRightResponse = {
    member: Member
}

type AddMemberToDBResponse = Either<
    { error: FetchReponseError },
    { inputData: AddMemberToDBRightResponse }
>

interface AddMemberToDBRequest {
    inputData: ExtractInputDataResponse,
    discord_id: string,
    discord_username: string
    discord_nickname?: string
}

export async function addMemberToDB({ inputData, discord_id, discord_username, discord_nickname }: AddMemberToDBRequest): Promise<AddMemberToDBResponse> {

    const body = JSON.stringify({
        ...inputData,
        discord_id, discord_username, discord_nickname,
        role: 'USER'
    })

    const requestOptions = {
        method: "post", body,
        headers: { "Content-Type": "application/json" },
    };

    const APIUrl = createURL("/member/")

    const response = await fetch(APIUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    return right({ inputData: { member: await response.json() } })
}