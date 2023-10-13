import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { getTeamNames } from "./utils/getTeamNames";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { description, name } from "./addMemberToTeamInfo.json"
import { createSelectTeamMenu } from "./utils/createSelectTeamMenu";

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

        const selectTeamMenu = await createSelectTeamMenu({ teamNames: getTeamNamesResponse.value.teamNames })

        const component = await makeStringSelectMenuComponent(selectTeamMenu)


        await interaction.editReply({
            content: "Selecione o time:",
            components: [await makeStringSelectMenuComponent(selectTeamMenu)],
        });
    },
});
