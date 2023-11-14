import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { TeamType } from "@/api/modules/teams/entities/team.entity";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { createURL } from "@/bot/utils/fetch/url";

type RemoveTeamFromDBResponse = Either<
    { error: ResourceNotFoundError },
    { deletedTeam: TeamType }
>

interface RemoveTeamFromDBRequest {
    name: string
}

export async function removeTeamFromDB({ name }: RemoveTeamFromDBRequest): Promise<RemoveTeamFromDBResponse> {

    const requestOptions = {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    };

    const createMemberUrl = createURL("/team/")

    const response = await fetch(createMemberUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const deletedTeam: TeamType = await response.json()

    return right({ deletedTeam })
}