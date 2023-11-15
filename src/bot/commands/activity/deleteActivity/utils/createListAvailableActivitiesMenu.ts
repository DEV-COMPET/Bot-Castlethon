import { makeStringSelectMenu } from "@/bot/utils/modal/makeSelectMenu"
import { ComponentType, SelectMenuComponentOptionData } from "discord.js"

import data from "@/bot/selectMenus/deleteActivity/deleteActivityMenuData.json"

interface CreateListAvailableActivitiesMenu {
    activitieNames: string[]
}

export async function createListAvailableActivitiesMenu({ activitieNames }: CreateListAvailableActivitiesMenu) {

    const options: SelectMenuComponentOptionData[] = activitieNames.map(name => {
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