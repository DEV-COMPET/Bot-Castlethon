import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "@/bot/selectMenus/addMemberToTeam/selectMember/selectMemberMenuData.json"
import { sucessReply } from "@/bot/utils/discord/editSucessReply";
import { addMemberToTeamInDB } from "./utils/addMemberToTeamInDB";
import { teamChosen } from "../selectTeam/variables/teamChosen";
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { giveMemberRole } from "./utils/giveMemberRole";

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {

        const memberDiscordId = interaction.values[0]

        const giveMemberRoleResponse = await giveMemberRole({ interaction, memberDiscordId, roleName: teamChosen[teamChosen.length - 1] })
        if (giveMemberRoleResponse.isLeft())
            return errorReply({
                error: giveMemberRoleResponse.value.error, interaction, title: "Erro ao fornecer o cargo ao membro"
            })

        const addMemberToTeamInDBResponse = await addMemberToTeamInDB({ memberDiscordId, teamName: teamChosen[teamChosen.length - 1] })
        if (addMemberToTeamInDBResponse.isLeft())
            return errorReply({
                error: addMemberToTeamInDBResponse.value.error, interaction, title: "Erro ao adicionar o membro no tine no DB"
            })

        await sucessReply({
            interaction,
            title: `Membro ${addMemberToTeamInDBResponse.value.memberName} adicionado ao time ${giveMemberRoleResponse.value.roleName}`
        })
    }
});
