import { createURL } from "@/bot/utils/fetch/url";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { Either, left, right } from "@/api/@types/either";
import { TeamType } from "@/api/modules/teams/entities/team.entity";

type GetTeamsTextChannelsResponse = Either<
    { error: FetchReponseError },
    { teamsTextChannels: string[] }
>

export async function getTeamsTextChannels(): Promise<GetTeamsTextChannelsResponse> {

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

    const teams: TeamType[] = await response.json();

    const teamsTextChannels = teams
        .map(team => team.name
            .toLowerCase()
            .replace(/\s/g, "-"))

    return right({ teamsTextChannels })
}