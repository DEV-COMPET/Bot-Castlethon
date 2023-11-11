import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { createURL } from "@/bot/utils/fetch/url";

type SaveAnswerOnDBResponse = Either<
    { error: DiscordError },
    { teamName: string, activityName: string }
>

interface SaveAnswerOnDBRequest {
    teamName: string
    answerText?: string
    answerDir?: string
    activityName: string
}

export async function saveAnswerOnDB({ activityName, answerDir, answerText, teamName }: SaveAnswerOnDBRequest): Promise<SaveAnswerOnDBResponse> {

    const requestOptions = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, answerDir, answerText, activityName })
    };

    const createMemberUrl = createURL("/answer/")

    const response = await fetch(createMemberUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    return right({ activityName, teamName })
}