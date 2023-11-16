import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./announceActivityData.json";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { ActivityType } from "@/api/modules/activities/entities/activity.entity";
import { menuAddOption } from "@/bot/utils/discord/makeSelectMenu";
import { listActivitiesToSendActivityMenu } from "@/bot/selectMenus/listActivitiesToSendActivity/listActivitiesToSendActivityMenu";

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

        const activities: ActivityType[] = listAvailableActivitiesResponse.value.responseData
        const activitieNames: string[] = activities
            .filter(activity => activity.opened_at)
            .filter(activity => !activity.closed_at)
            .map(activity => activity.name)

        if (activitieNames.length === 0)
            return await editErrorReply({
                interaction, title: "Nenhuma atividade disponivel.", error: new Error("Nenhuma atividade disponivel.")
            })

        const menu = menuAddOption({
            menu: listActivitiesToSendActivityMenu, optionData: activitieNames.map(name => {
                return {
                    label: name, value: name
                }
            })
        })
        if (menu.isLeft())
            return await editErrorReply({
                error: menu.value.error, interaction,
                title: menu.value.error.message
            })

        return await interaction.editReply({
            content: "Selecione a atividade:",
            components: [menu.value.menu],
        });
    },
});
