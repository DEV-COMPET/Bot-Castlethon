import { Either, left, right } from "@/api/@types/either";
import { ActivityType } from "@/api/modules/activities/entities/activity.entity";
import { FetchReponseError } from "@/bot/errors/fetchReponseError";
import { createURL } from "@/bot/utils/fetch/url";

type ListAvailableActivitiesResponse = Either<
    { error: FetchReponseError },
    { availableActivities: string[] }
>

export async function listAvailableActivities(): Promise<ListAvailableActivitiesResponse> {

    const requestOptions = {
        method: "get",
        headers: { "Content-Type": "application/json" },
    };

    const createMemberUrl = createURL("/activity/")

    const response = await fetch(createMemberUrl, requestOptions);
    if (!(response.status >= 200 && response.status < 300)) {
        const { code, message, status }: { code: number; message: string; status: number } = await response.json();
        return left({ error: new FetchReponseError({ code, message, status }) })
    }

    const activities: ActivityType[] = await response.json();

    const availableActivities: string[] = activities
        .filter(activity => activity.opened_at)
        .filter(activity => !activity.closed_at)
        .map(activity => activity.name)
    if (availableActivities.length === 0)
        return left({ error: new FetchReponseError({ code: 404, message: "No available activities", status: 404 }) })

    return right({ availableActivities })
}