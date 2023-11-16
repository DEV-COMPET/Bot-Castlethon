import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { Role, getDiscordTeamData } from "./getTeamNamesInDiscordRoles";
import { DiscordError } from "@/bot/errors/discordError";
import { teamsRemovableData } from "../variables/teamdRemovableData";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { TeamType } from "@/api/modules/teams/entities/team.entity";

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

  // const getTeamNamesInDBResponse = await getTeamNamesInDB()
  const getTeamNamesInDBResponse = await fetchDataFromAPI({
    json: true, method: "get", url: "/team/"
  })
  if (getTeamNamesInDBResponse.isLeft())
    return left({ error: getTeamNamesInDBResponse.value.error })
  
  const teams: TeamType[] = getTeamNamesInDBResponse.value.responseData
  const DBNames: string[] = teams.map(team => team.name.toLowerCase())

  const getDiscordTeamDataResponse = await getDiscordTeamData({ interaction })

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