import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./recieveActivitiesAnswersData.json";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { createListAvailableActivitiesMenu } from "./utils/createListAvailableActivitiesMenu";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { ActivityType } from "@/api/modules/activities/entities/activity.entity";

export default new Command({
    name,
    description,

    run: async function ({ interaction }) {

        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        // const listAvailableActivitiesResponse = await listAvailableActivities();
        const listAvailableActivitiesResponse = await fetchDataFromAPI({
            json: true, method: "get", url: "/activity/"
        })
        if (listAvailableActivitiesResponse.isLeft())
            return await editErrorReply({
                error: listAvailableActivitiesResponse.value.error,
                interaction, title: "Erro ao pegar as atividades."
            })

        const activities: ActivityType[] = await listAvailableActivitiesResponse.value.responseData

        const activitieNames: string[] = activities
            .filter(activity => activity.opened_at)
            .filter(activity => !activity.closed_at)
            .map(activity => activity.name)

        if (activitieNames.length === 0)
            return await editErrorReply({
                interaction, title: "Nenhuma atividade disponivel.", error: new Error("Nenhuma atividade disponivel.")
            })

        const listAvailableActivitiesMenu = await createListAvailableActivitiesMenu({ activitieNames });

        return await interaction.editReply({
            content: "Selecione a atividade:",
            components: [await makeStringSelectMenuComponent(listAvailableActivitiesMenu)],
        });
    },
});
