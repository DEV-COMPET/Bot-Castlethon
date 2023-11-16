import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from './getActivitieAnswersMenuData.json'
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { ActivityType } from "@/api/modules/activities/entities/activity.entity";
import { getAndSaveAnswers } from "./utils/getAndSaveAnswers";
import { makeSelectMenu } from "@/bot/utils/discord/makeSelectMenu";

export const getActivitieAnswersMenu = makeSelectMenu({
    customId, max: minMax.max, min: minMax.min,
})

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true });

        const activityName = interaction.values[0] as string

        const fetchActivity = await fetchDataFromAPI({ json: true, method: "GET", url: `/activity/${activityName}` })
        if (fetchActivity.isLeft())
            return await editErrorReply({
                error: fetchActivity.value.error, interaction, title: "Erro ao pegar a atividade"
            })

        const activity = fetchActivity.value.responseData as ActivityType

        const getAndSaveAnswersResponse = await getAndSaveAnswers({ activity, interaction })
        if (getAndSaveAnswersResponse.isLeft()) {
            console.log("Viu que é left")
            return await editErrorReply({
                error: getAndSaveAnswersResponse.value.error, interaction, title: "Erro ao salvar as respostas"
            })
        }
        console.log("Indo retornar")
            
        return await editSucessReply({
            interaction, title: "Arquivo enviado com sucesso!",
            fields: getAndSaveAnswersResponse.value.answerStatus.map(answer => ({
                name: answer.teamName,
                value: answer.type
            }))
        });

    }
});











