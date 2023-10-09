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

export async function addMemberToDB(inputData: ExtractInputDataResponse): Promise<AddMemberToDBResponse> {

    const requestOptions = {
        method: "post",
        body: JSON.stringify({ ...inputData, role: "USER" }),
        headers: { "Content-Type": "application/json" },
    };

    console.log({input: { ...inputData, role: "USER" }})

    const APIUrl = createURL("/member/")

    const response = await fetch(APIUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    return right({ inputData: { member: await response.json() } })
}