import { testMenu } from "@/bot/selectMenus/test/test";
import { Command } from "@/bot/structures/Command";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";

export default new Command({
  name: "menu",
  description: "mostra um menu  ",
  run: async function ({ interaction }) {

    await interaction.reply({
      content: "menus",
      components: [await makeStringSelectMenuComponent(testMenu)],
      ephemeral: true
    });
  },
});
