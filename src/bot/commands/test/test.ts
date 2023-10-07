import { testMenu } from "@/bot/selectMenus/test/test";
import { Command } from "@/bot/structures/Command";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export default new Command({
  name: "menu",
  description: "mostra um menu  ",
  run: async function ({ interaction }) {

    await interaction.reply({
      content: "menus",
      components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(testMenu)]
    });
  },
});
