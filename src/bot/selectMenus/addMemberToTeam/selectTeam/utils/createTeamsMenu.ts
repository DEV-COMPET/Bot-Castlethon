import { ComponentType, SelectMenuComponentOptionData, StringSelectMenuBuilder } from "discord.js";
import { makeStringSelectMenu } from "@/bot/utils/modal/makeSelectMenu";
import { MemberData } from "@/bot/commands/member/createMember/createMember";

import data from "../../selectMember/selectMemberMenuData.json"

interface CreateTeamsMenuRequest {
    availableMembers: MemberData[]
}

export function createSelectMemberToBeAddedMenu({ availableMembers }: CreateTeamsMenuRequest): StringSelectMenuBuilder {

    const options: SelectMenuComponentOptionData[] = availableMembers.map(member => {
        return {
            label: `${member.username} (${member.nickName})`,
            value: member.id
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