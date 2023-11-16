import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { description, name } from "./deleteTeamInfo.json"
import { getRemovableTeamsName } from "./utils/getRemovableTeamsName";
import { menuAddOption } from "@/bot/utils/discord/makeSelectMenu";
import { listTeamsToBeRemovedMenu } from "@/bot/selectMenus/deleteTeam/listTeamsToBeRemovedMenu";

export default new Command({
    name, description,
    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response

        const getRemovableTeamsNamesResponse = await getRemovableTeamsName({ interaction })
        if (getRemovableTeamsNamesResponse.isLeft())
            return await editErrorReply({
                error: getRemovableTeamsNamesResponse.value.error,
                interaction, title: "Nenhum time está cadastrado no DB e no discord."
            })

        const copyMenu = listTeamsToBeRemovedMenu
        const menu = menuAddOption({
            menu: copyMenu, optionData: getRemovableTeamsNamesResponse.value.teamNames.map((name, index) => {
                return { label: name, value: `team-${index}` }
            })
        })
        if (menu.isLeft())
            return await editErrorReply({
                error: menu.value.error, interaction,
                title: menu.value.error.message
            })

        return await interaction.editReply({
            content: "Times Disponíveis:",
            components: [menu.value.menu],
        });
    },
});
