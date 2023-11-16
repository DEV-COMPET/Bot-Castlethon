import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from "./selectTeamColorMenuData.json"
import { createTeamModal } from "@/bot/modals/createTeam/createTeam";
import { teamColor } from "./variables/color";
import { makeSelectMenu } from "@/bot/utils/discord/makeSelectMenu";

export const selectTeamColorMenu = makeSelectMenu({
    customId, max: minMax.max, min: minMax.min,
})

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        const selectedColorHex = interaction.values[0] as string

        teamColor.push(selectedColorHex)

        await interaction.showModal(createTeamModal)
    }
});
