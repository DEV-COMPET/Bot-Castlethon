import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./createTeamData.json";
import { getAllRolesColors } from "./utils/getAllRolesColors";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { ComponentType } from "discord.js";

import selectColorMenuData from "@/bot/selectMenus/createTeam/selectTeamColorMenuData.json"

export default new Command({
    name,
    description,
    run: async function ({ interaction }) {

        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        const getAllRolesColorsResponse = await getAllRolesColors({ interaction })
        if (getAllRolesColorsResponse.isLeft())
            return await editErrorReply({
                error: getAllRolesColorsResponse.value.error, interaction,
                title: getAllRolesColorsResponse.value.error.message
            });

        const { customId, minMax } = selectColorMenuData

        const listRoleColorsMenu = makeStringSelectMenu({
            customId: customId,
            type: ComponentType.StringSelect,
            options: getAllRolesColorsResponse.value.colors.map(color => { 
                return { 
                    label: color.name, 
                    value: color.name
                }
            }),
            maxValues: minMax.max,
            minValues: minMax.min
        });

        return await interaction.editReply({
            content: "Cores Disponíveis:",
            components: [await makeStringSelectMenuComponent(listRoleColorsMenu)],
        });
    },
});
