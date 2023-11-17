import { Event } from "../structures/Event";
import { client } from "..";
import {
  CommandInteractionOptionResolver,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { ExtendedInteraction } from "../typings/Commands";
import { ExtendedModalInteraction } from "../typings/Modals";
import { ExtendedStringSelectMenuInteraction } from "../typings/SelectMenu";
export default new Event("interactionCreate", "on", async (interaction) => {
  if (interaction.isChatInputCommand()) {

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      await interaction.followUp("Você usou um comando não existente!");
      return;
    }
    try {
      await command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: "Houve um erro ao tentar executar esse comando",
        ephemeral: true,
      });

    }
  } else if (interaction.isModalSubmit()) {
    const modalInteraction: ModalSubmitInteraction = interaction;
    const command = client.modals.get(interaction.customId);

    if (!command) {
      await modalInteraction.deferReply();
      await modalInteraction.followUp("Você usou um comando não existente");
      return;
    }
    try {
      await command.run({
        client,
        interaction: modalInteraction as ExtendedModalInteraction,
      });
    } catch (error) {
      console.error(error);
    }
  } else if (interaction.isStringSelectMenu()) {
    const selectMenuInteraction: StringSelectMenuInteraction = interaction;
    const command = client.selectMenus.get(interaction.customId);

    if (!command) {
      await selectMenuInteraction.deferReply();
      await selectMenuInteraction.followUp("Você usou um comando não existente");
      return;
    }
    try {
      await command.run({
        client,
        interaction: selectMenuInteraction as ExtendedStringSelectMenuInteraction,
      });
    } catch (error) {
      console.error(error);
    }
  }
});
