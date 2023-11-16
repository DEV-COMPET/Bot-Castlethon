import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { description, name } from "./addMemberToTeamInfo.json"
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { Team } from "discord.js";
import { menuAddOption } from "@/bot/utils/discord/makeSelectMenu";
import { selectTeamMenu } from "@/bot/selectMenus/addMemberToTeam/selectTeam/selectTeamMenu";

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

        const menu = menuAddOption({
            menu: selectTeamMenu, optionData: teamNames.map(teamName => {
                return { label: teamName, value: teamName }
            })
        })
        if (menu.isLeft())
            return await editErrorReply({ interaction, title: "Erro ao criar menu", error: menu.value.error })

        return await interaction.editReply({
            content: "Selecione o time:",
            components: [menu.value.menu],
        });
    },
});
