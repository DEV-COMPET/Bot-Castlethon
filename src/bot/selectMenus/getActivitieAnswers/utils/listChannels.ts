import { Either, left, right } from "@/api/@types/either";
import { ActivityMessage, ActivityType } from "@/api/modules/activities/entities/activity.entity";
import { DiscordError } from "@/bot/errors/discordError";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { createURL } from "@/bot/utils/fetch/url";

type ListChannelsResponse = Either<
    { error: DiscordError },
    { channels: ActivityMessage[] }
>

interface ListChannelsRequest {
    activityName: string
}

export async function listChannels({ activityName }: ListChannelsRequest): Promise<ListChannelsResponse> {

    const requestOptions = {
        method: "get",
        headers: { "Content-Type": "application/json" },
    };

    const createMemberUrl = createURL(`/activity/${activityName}`)

    const response = await fetch(createMemberUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const activity: ActivityType = await response.json();

    console.dir(activity, { depth: null })

    return right({ channels: activity.chatMessagesIds })
}