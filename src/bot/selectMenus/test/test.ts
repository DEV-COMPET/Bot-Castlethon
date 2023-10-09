import { ComponentType } from "discord.js";
import { SelectMenu } from "@/bot/structures/SelectMenu";
import { makeStringSelectMenu } from "@/bot/utils/modal/makeSelectMenu";

const testMenu = makeStringSelectMenu({
    customId: 'sub-menu',
    minValues: 1,
    maxValues: 1,
    type: ComponentType.StringSelect,
    options: [
        {
            label: "Titulo 1",
            value: "Valor 1"
        },
        {
            label: "Titulo 2",
            value: "Valor 2"
        }
    ]
})

export default new SelectMenu({
    customId: "sub-menu",

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        console.log("Foi chamado")

        console.dir({valores: interaction.values})

        return await interaction.editReply({
            content: `You selected: ${interaction.values[0]}`
        })
    }
});

export { testMenu };
