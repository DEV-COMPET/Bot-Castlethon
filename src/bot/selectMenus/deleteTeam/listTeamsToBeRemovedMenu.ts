import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from "./deleteTeamMenuData.json"
import { teamsRemovableData } from "@/bot/commands/team/deleteTeam/variables/teamdRemovableData";
import { removeTeamFromDiscord } from "./utils/removeTeamFromDiscord";
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply, sucessReply } from "@/bot/utils/discord/editSucessReply";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { makeSelectMenu } from "@/bot/utils/discord/makeSelectMenu";

export const listTeamsToBeRemovedMenu = makeSelectMenu({
    customId, max: minMax.max, min: minMax.min,
})

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true });

        const selectedTeamName = interaction.values[0] as string

        const removeData = teamsRemovableData[teamsRemovableData.length - 1];

        const possibleDBName = removeData.roleDBName.find(name => name.toLocaleLowerCase() === selectedTeamName)
        const possibleRoleData = removeData.roleData.find(role => role.name.toLocaleLowerCase() === selectedTeamName)

        if (!possibleDBName && !possibleRoleData)
            return await errorReply({
                interaction, title: "Erro ao remover o time: nenhum dado passado valido.", error: new Error("Nenhum time foi encontrado")
            })

        if (possibleDBName) {
            // const removeTeamFromDBResponse = await removeTeamFromDB({ name: possibleDBName })
            const removeTeamFromDBResponse = await fetchDataFromAPI({
                json: true, method: "delete", url: "/team/", bodyData: { name: possibleDBName }
            })
            if (removeTeamFromDBResponse.isLeft())
                return await errorReply({
                    interaction, title: "Erro ao remover o time do DB", error: removeTeamFromDBResponse.value.error
                })
        }

        if (possibleRoleData) {
            const removeTeamFromDiscordResponse = await removeTeamFromDiscord({ roleData: possibleRoleData.data, interaction })
            if (removeTeamFromDiscordResponse.isLeft())
                return await errorReply({
                    interaction, title: "Erro ao remover o time do discord", error: removeTeamFromDiscordResponse.value.error
                })
        }

        return await editSucessReply({
            interaction, title: `Suceso ao remover o time "${possibleDBName ?? possibleRoleData?.name}"`
        })
    }
});
