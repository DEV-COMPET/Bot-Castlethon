import { ComponentType, SelectMenuComponentOptionData, StringSelectMenuBuilder } from "discord.js";
import { name } from "@/bot/commands/addMemberToTeam/addMemberToTeamInfo.json"
import data from "@/bot/selectMenus/addMemberToTeam/addMemberToTeamTeamMenuData.json"
import { makeStringSelectMenu } from "@/bot/utils/modal/makeSelectMenu";

interface CreateTeamsMenuRequest {
    teamNames: string[]
}

export function createTeamsMenu({ teamNames }: CreateTeamsMenuRequest): StringSelectMenuBuilder {

    const options: SelectMenuComponentOptionData[] = teamNames.map(name => {
        return {
            label: name, value: name
        }
    })

    const menu = makeStringSelectMenu({
        customId: name,
        minValues: data.minMax.min,
        maxValues: data.minMax.max,
        type: ComponentType.StringSelect,
        options
    })

    return menu
}