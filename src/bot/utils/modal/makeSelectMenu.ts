import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuComponentData } from "discord.js";

export function makeStringSelectMenu(menuData: StringSelectMenuComponentData): StringSelectMenuBuilder {

  const menu = new StringSelectMenuBuilder(menuData)

  return menu
}

export async function makeStringSelectMenuComponent(menu: StringSelectMenuBuilder): Promise<ActionRowBuilder<StringSelectMenuBuilder>> {

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)
}
