import { Either, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { getTeamNamesInDB } from "./getTeamNames";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { Role, getDiscordTeamData } from "./getTeamNamesInDiscordRoles";
import { DiscordError } from "@/bot/errors/discordError";
import { teamsRemovableData } from "../variables/teamdRemovableData";

type GetRemovableTeamsNameResponse = Either<
  { error: DiscordError | ResourceNotFoundError },
  { teamNames: string[] }
>

interface GetRemovableTeamsNameRequest {
  interaction: ExtendedInteraction
}

export interface DiscordDataItem {
  name: string;
  data: { [key: string]: string };
}

export async function getRemovableTeamsName({ interaction }: GetRemovableTeamsNameRequest): Promise<GetRemovableTeamsNameResponse> {

  const getTeamNamesInDBResponse = await getTeamNamesInDB()

  const getDiscordTeamDataResponse = await getDiscordTeamData({ interaction })

  const DBNames: string[] = (getTeamNamesInDBResponse.isRight() ? getTeamNamesInDBResponse.value.teamNames : [])

  const discordData: Role[] = getDiscordTeamDataResponse.isRight() ? getDiscordTeamDataResponse.value.roles : []

  const alteredData: DiscordDataItem[] = [];

  for (const item of discordData) {
    const existingItem = alteredData.find((el) => el.name === item.name);

    if (existingItem)
      Object.assign(existingItem.data, item.data);
    else
      alteredData.push({ "name": item.name, "data": { ...item.data } });
  }

  teamsRemovableData.push({
    roleData: alteredData,
    roleDBName: DBNames
  })

  const discordNames: string[] = (getDiscordTeamDataResponse.isRight() ? getDiscordTeamDataResponse.value.roles.map(role => role.name) : [])

  const teamNames: string[] = Array.from(new Set([...DBNames, ...discordNames]));

  return right({ teamNames })
}