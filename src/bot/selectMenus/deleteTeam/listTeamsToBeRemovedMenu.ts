import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./deleteTeamMenuData.json"
import { teamsRemovableData } from "@/bot/commands/team/deleteTeam/variables/teamdRemovableData";
import { removeTeamFromDB } from "@/bot/commands/team/deleteTeam/utils/removeTeamInDB";
import { removeTeamFromDiscord } from "./utils/removeTeamFromDiscord";
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { sucessReply } from "@/bot/utils/discord/editSucessReply";

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        const selectedTeamName = interaction.values[0] as string

        const removeData = teamsRemovableData[teamsRemovableData.length - 1];

        const possibleDBName = removeData.roleDBName.find(name => name.toLocaleLowerCase() === selectedTeamName)
        const possibleRoleData = removeData.roleData.find(role => role.name.toLocaleLowerCase() === selectedTeamName)

        if (!possibleDBName && !possibleRoleData)
            return await errorReply({
                interaction, title: "Erro ao remover o time: nenhum dado passado valido.", error: new Error("Nenhum time foi encontrado")
            })

        if (possibleDBName) {
            const removeTeamFromDBResponse = await removeTeamFromDB({ name: possibleDBName })
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

        return await sucessReply({
            interaction, title: `Suceso ao remover o time "${possibleDBName ?? possibleRoleData?.name}"`
        })
    }
});
