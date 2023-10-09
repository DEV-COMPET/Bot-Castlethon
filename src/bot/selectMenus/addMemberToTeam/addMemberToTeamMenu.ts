import { SelectMenu } from "@/bot/structures/SelectMenu";
import { name } from "@/bot/commands/addMemberToTeam/addMemberToTeamInfo.json"

export default new SelectMenu({
    customId: name,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        await interaction.editReply({
            content: `You selected: ${interaction.values}`
        })

    }
});
