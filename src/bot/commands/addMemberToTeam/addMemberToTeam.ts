import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { getTeamNames } from "./utils/getTeamNames";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { description, name } from "./addMemberToTeamInfo.json"
import { createTeamsMenu } from "../../selectMenus/addMemberToTeam/utils/createTeamsMenu";

export default new Command({
    name, description,
    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response

        const getTeamNamesResponse = await getTeamNames()
        if (getTeamNamesResponse.isLeft())
            return await editErrorReply({
                error: getTeamNamesResponse.value.error,
                interaction, title: "Nenhum time cadastrado"
            })

        const teamsMenu = createTeamsMenu({ teamNames: getTeamNamesResponse.value.teamNames })

        await interaction.editReply({
            components: [await makeStringSelectMenuComponent(teamsMenu)],
        });
    },
});
