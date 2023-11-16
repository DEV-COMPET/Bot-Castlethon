import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "@/bot/selectMenus/addMemberToTeam/selectMember/selectMemberMenuData.json"
import { sucessReply } from "@/bot/utils/discord/editSucessReply";
import { teamChosen } from "../selectTeam/variables/teamChosen";
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { giveMemberRole } from "./utils/giveMemberRole";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {

        const memberDiscordId = interaction.values[0]

        const giveMemberRoleResponse = await giveMemberRole({ interaction, memberDiscordId, roleName: teamChosen[teamChosen.length - 1] })
        if (giveMemberRoleResponse.isLeft())
            return errorReply({
                error: giveMemberRoleResponse.value.error, interaction, title: "Erro ao fornecer o cargo ao membro"
            })

        // const addMemberToTeamInDBResponse = await addMemberToTeamInDB({ memberDiscordId, teamName: teamChosen[teamChosen.length - 1] })
        const addMemberToTeamInDBResponse = await fetchDataFromAPI({
            json: false, method: "put", url: `/team/addmember/`,
            bodyData: {
                memberDiscordId,
                teamName: teamChosen[teamChosen.length - 1]
            }
        })
        if (addMemberToTeamInDBResponse.isLeft())
            return errorReply({
                error: addMemberToTeamInDBResponse.value.error, interaction, title: "Erro ao adicionar o membro no tine no DB"
            })

        const memberName = await addMemberToTeamInDBResponse.value.responseData as string

        await sucessReply({
            interaction,
            title: `Membro ${memberName} adicionado ao time ${giveMemberRoleResponse.value.roleName}`
        })
    }
});
