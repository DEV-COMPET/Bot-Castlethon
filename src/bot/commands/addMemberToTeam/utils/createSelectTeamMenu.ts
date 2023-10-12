import { ComponentType, SelectMenuComponentOptionData, StringSelectMenuBuilder } from "discord.js";
import { makeStringSelectMenu } from "@/bot/utils/modal/makeSelectMenu";

import data from "@/bot/selectMenus/addMemberToTeam/selectTeam/selectTeamMenuData.json"

interface CreateSelectTeamMenuRequest {
    teamNames: string[]
}

export function createSelectTeamMenu({ teamNames }: CreateSelectTeamMenuRequest): StringSelectMenuBuilder {

    const options: SelectMenuComponentOptionData[] = teamNames.map(name => {
        return {
            label: name, value: name
        }
    })

    const menu = makeStringSelectMenu({
        customId: data.customId,
        minValues: data.minMax.min,
        maxValues: data.minMax.max,
        type: ComponentType.StringSelect,
        options
    })

    return menu
}