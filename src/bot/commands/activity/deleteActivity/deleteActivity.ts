import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./deleteActivityData.json";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { Activity } from "@/api/modules/activities/entities/activity.entity";
import { menuAddOption } from "@/bot/utils/discord/makeSelectMenu";
import { deleteActivityMenu } from "@/bot/selectMenus/deleteActivity/deleteActivityMenu";

export default new Command({
    name, description,

    run: async function ({ interaction }) {

        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        const listAvailableActivitiesResponse = await fetchDataFromAPI({
            json: true, method: "GET", url: "/activity/"
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

        console.dir({ activitieNames }, { depth: null })

        const menu = menuAddOption({
            menu: deleteActivityMenu, optionData: activitieNames.map(name => {
                return { label: name, value: name }
            }),
        })
        if (menu.isLeft())
            return await editErrorReply({
                error: menu.value.error, interaction,
                title: menu.value.error.message
            });

        return await interaction.editReply({
            content: "Selecione a atividade:",
            components: [menu.value.menu],
        });

    },
});
