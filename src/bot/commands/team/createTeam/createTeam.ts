import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./createTeamData.json";
import { getAllRolesColors } from "./utils/getAllRolesColors";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { menuAddOption } from "@/bot/utils/discord/makeSelectMenu";
import { selectTeamColorMenu } from "@/bot/selectMenus/createTeam/selectTeamColorMenu";

export default new Command({
    name, description,
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

        const copyMenu = selectTeamColorMenu
        const menu = menuAddOption({
            menu: copyMenu, optionData: getAllRolesColorsResponse.value.colors.map(color => {
                return {
                    label: color.name,
                    value: color.name
                }
            }),
        })
        if (menu.isLeft())
            return await editErrorReply({
                error: menu.value.error, interaction,
                title: menu.value.error.message
            });

        return await interaction.editReply({
            content: "Cores Disponíveis:",
            components: [menu.value.menu],
        });
    },
});
