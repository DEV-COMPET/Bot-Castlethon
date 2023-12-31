import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { description, name } from "./deleteTeamInfo.json"
import { getRemovableTeamsName } from "./utils/getRemovableTeamsName";
import { makeStringSelectMenu, makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";

import { customId, minMax } from "@/bot/selectMenus/deleteTeam/deleteTeamMenuData.json"
import { ComponentType } from "discord.js";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

export default new Command({
    name, description,
    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if (isNotAdmin.isRight())
            return isNotAdmin.value.response

        await editLoadingReply({ interaction, title: "Carregando times..." })

        const getRemovableTeamsNamesResponse = await getRemovableTeamsName({ interaction })
        if (getRemovableTeamsNamesResponse.isLeft())
            return await editErrorReply({
                error: getRemovableTeamsNamesResponse.value.error,
                interaction, title: "Nenhum time está cadastrado no DB e no discord."
            })
        if (getRemovableTeamsNamesResponse.value.teamNames.length === 0)
            return await editErrorReply({
                error: new Error("Nenhum time está cadastrado no DB e no discord."),
                interaction, title: "Nenhum time está cadastrado no DB e no discord."
            })

        const listTeamsToBeRemovedMenu = makeStringSelectMenu({
            customId: customId,
            type: ComponentType.StringSelect,
            options: getRemovableTeamsNamesResponse.value.teamNames.map(name => { return { label: name, value: name } }),
            maxValues: minMax.max,
            minValues: minMax.min
        });

        return await interaction.editReply({
            content: "Times Disponíveis:",
            components: [await makeStringSelectMenuComponent(listTeamsToBeRemovedMenu)],
        });
    },
});
