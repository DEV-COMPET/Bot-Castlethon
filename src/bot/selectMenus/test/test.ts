import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { SelectMenu } from "@/bot/structures/SelectMenu";

const testMenu = new StringSelectMenuBuilder()
    .setCustomId('sub-menu')
    .setMinValues(1)
    .setMaxValues(1)
    .setOptions(
        new StringSelectMenuOptionBuilder({
            label: "Option 1",
            value: "https://example.com/option1"
        }),
        new StringSelectMenuOptionBuilder({
            label: "Option 2",
            value: "https://example.com/option2"
        })
    );

export default new SelectMenu({
    customId: "sub-menu",

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        console.log("Foi chamado")

        return await interaction.editReply({
            content: `You selected: ${interaction.values[0]}`
        })
    }
});

export { testMenu };
