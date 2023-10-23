import { DiscordDataItem } from "../utils/getRemovableTeamsName"

interface TeamsRemovableData {
    roleData: DiscordDataItem[],
    roleDBName: string[]
}

export const teamsRemovableData: TeamsRemovableData[] = []