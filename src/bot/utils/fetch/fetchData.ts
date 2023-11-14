import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { createURL } from "@/bot/utils/fetch/url";

type FetchDataFromAPIResponse = Either<
    { error: DiscordError },
    { responseData: any }
>

interface FetchDataFromAPIRequest {
    method: string, 
    url: string,
    json: boolean
    bodyData?: any 
}

export async function fetchDataFromAPI({ method, url, json, bodyData }: FetchDataFromAPIRequest): Promise<FetchDataFromAPIResponse> {

    const requestOptions = {
        method,
        headers: { "Content-Type": "application/json" },
    };

    if(bodyData) 
        Object.assign(requestOptions, { body: JSON.stringify(bodyData) })

    const createMemberUrl = createURL(url)

    const response = await fetch(createMemberUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const responseData = json ? await response.json() : await response.text();

    return right({ responseData })
}