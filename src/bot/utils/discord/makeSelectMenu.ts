import { ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from "discord.js"
import { Either, left, right } from "@/api/@types/either"

interface MakeSelectMenuRequest {
    customId: string
    min: number
    max: number
}

export function makeSelectMenu({ customId, max, min }: MakeSelectMenuRequest): StringSelectMenuBuilder {

    const menu = new StringSelectMenuBuilder({
        customId: customId,
        minValues: min,
        maxValues: max,
        type: ComponentType.StringSelect,
        options: []
    })

    return menu
}

interface MenuAddOptionRequest {
    menu: StringSelectMenuBuilder
    optionData: { label: string, value: string }[]
}

type MenuAddOptionResponse = Either<
    { error: Error },
    { menu: ActionRowBuilder<StringSelectMenuBuilder> }
>

export function menuAddOption({ menu, optionData }: MenuAddOptionRequest): MenuAddOptionResponse {

    if (optionData.length === 0)
        return left({ error: new Error("optionData is empty") })

    menu.addOptions(optionData.map(option => {
        return {
            label: option.label,
            value: option.value
        }
    }))

    return right({ menu: new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu) })
}