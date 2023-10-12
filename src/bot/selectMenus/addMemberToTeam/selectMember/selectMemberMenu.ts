import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "@/bot/selectMenus/addMemberToTeam/selectMember/selectMemberMenuData.json"
import { sucessReply } from "@/bot/utils/discord/editSucessReply";
import { addMemberToTeamInDB } from "./utils/addMemberToTeamInDB";
import { teamChosen } from "../selectTeam/variables/teamChosen";
import { errorReply } from "@/bot/utils/discord/editErrorReply";

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {

        console.log("Direto")

        const memberName = interaction.values[0]

        const addMemberToTeamInDBResponse = await addMemberToTeamInDB({ memberName, teamName: teamChosen[teamChosen.length - 1] })
        if (addMemberToTeamInDBResponse.isLeft())
            return errorReply({
                error: addMemberToTeamInDBResponse.value.error, interaction, title: "Erro ao adicionar o membro no tine no DB"
            })

        await sucessReply({ interaction, title: "Membro adicionado ao time" })
    }
});