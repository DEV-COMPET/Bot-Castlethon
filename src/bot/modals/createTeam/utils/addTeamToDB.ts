import { createURL } from "@/bot/utils/fetch/url";
import { Team } from "@/api/modules/teams/entities/team.entity";
import { Either, left, right } from "@/api/@types/either";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";

export type AddTeamToDBRightResponse = {
    team: Team
}

type AddTeamToDBResponse = Either<
    { error: FetchReponseError },
    { inputData: AddTeamToDBRightResponse }
>

interface AddTeamToDBRequest {
    name: string,
    institution: string
}

export async function addTeamToDB({ institution, name }: AddTeamToDBRequest): Promise<AddTeamToDBResponse> {

    const requestOptions = {
        method: "post", body: JSON.stringify({ institution, name }),
        headers: { "Content-Type": "application/json" },
    };

    const APIUrl = createURL("/team/")

    const response = await fetch(APIUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    return right({ inputData: { team: await response.json() } })
}