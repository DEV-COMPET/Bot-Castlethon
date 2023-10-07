import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuComponentData } from "discord.js";

export function makeStringSelectMenu(menuData: StringSelectMenuComponentData): StringSelectMenuBuilder {

  const menu = new StringSelectMenuBuilder(menuData)

  return menu
}

export function makeStringSelectMenuComponent(menu: StringSelectMenuBuilder): ActionRowBuilder<StringSelectMenuBuilder> {

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)
}
