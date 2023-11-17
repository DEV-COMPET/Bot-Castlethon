import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./deleteActivityData.json";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { createListAvailableActivitiesMenu } from "./utils/createListAvailableActivitiesMenu";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { Activity } from "@/api/modules/activities/entities/activity.entity";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

export default new Command({
    name,
    description,

    run: async function ({ interaction }) {

        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }
        await editLoadingReply({ interaction, title: "(1/1) Buscando as atividades disponíveis...." })

        const listAvailableActivitiesResponse = await fetchDataFromAPI({
            json: true, method: "GET", url: "/activity"
        })
        if (listAvailableActivitiesResponse.isLeft())
            return await editErrorReply({
                error: listAvailableActivitiesResponse.value.error,
                interaction, title: "Erro ao pegar as atividades."
            })

        const availableActivities = listAvailableActivitiesResponse.value.responseData as Activity[]
        if (availableActivities.length === 0)
            return await editErrorReply({
                error: new Error("No available activities"),
                interaction, title: "Não há atividades disponíveis."
            })

        const activitieNames = availableActivities.map(activity => activity.name)
        if (activitieNames.length === 0)
            return await editErrorReply({
                error: new Error("No available activities"),
                interaction, title: "Não há atividades disponíveis."
            })

        const listAvailableActivitiesMenu = await createListAvailableActivitiesMenu({ activitieNames });

        return await interaction.editReply({
            content: "Selecione a atividade:",
            components: [await makeStringSelectMenuComponent(listAvailableActivitiesMenu)],
        });

    },
});
