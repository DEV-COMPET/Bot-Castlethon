import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { TeamType } from "@/api/modules/teams/entities/team.entity";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { createURL } from "@/bot/utils/fetch/url";

type GetTeamNamesResponse = Either<
    { error: ResourceNotFoundError },
    { teamNames: string[] }
>

export async function getTeamNamesInDB(): Promise<GetTeamNamesResponse> {
    const requestOptions = {
        method: "get",
        headers: { "Content-Type": "application/json" },
    };

    const createMemberUrl = createURL("/team/")

    const response = await fetch(createMemberUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const teams: TeamType[] = await response.json()

    const teamNames: string[] = teams.map(team => team.name.toLowerCase())

    return right({ teamNames })
}