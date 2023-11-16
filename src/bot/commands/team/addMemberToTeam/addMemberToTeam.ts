import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { description, name } from "./addMemberToTeamInfo.json"
import { createSelectTeamMenu } from "./utils/createSelectTeamMenu";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { Team } from "discord.js";

export default new Command({
    name, description,
    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response

        const getTeamNamesResponse = await fetchDataFromAPI({
            json: true, method: "get", url: "/team/"
        })
        if (getTeamNamesResponse.isLeft())
            return await editErrorReply({
                error: getTeamNamesResponse.value.error,
                interaction, title: "Nenhum time cadastrado"
            })

        const teams: Team[] = getTeamNamesResponse.value.responseData
        const teamNames = teams.map(team => team.name)

        const selectTeamMenu = await createSelectTeamMenu({ teamNames })

        await interaction.editReply({
            content: "Selecione o time:",
            components: [await makeStringSelectMenuComponent(selectTeamMenu)],
        });
    },
});
