import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from './deleteActivityMenuData.json'
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { ActivityType } from "@/api/modules/activities/entities/activity.entity";
import { deleteActivityFolder } from "@/bot/utils/googleAPI/googleDrive/deleteFolder";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true });

        await editLoadingReply({ interaction, title: "(1/2) Deletando do DB...." })

        const activityName = interaction.values[0] as string

        const fetchActivity = await fetchDataFromAPI({ 
            json: true, method: "DELETE", url: `/activity`, 
            bodyData: { name: activityName } 
        })
        if (fetchActivity.isLeft())
            return await editErrorReply({
                error: fetchActivity.value.error, interaction, title: `Erro ao remover a atividade '${activityName}' do DB`
            })

        const activity = fetchActivity.value.responseData as ActivityType

        await editLoadingReply({ interaction, title: "(2/2) Deletando do Google Drive...." })

        const deleteActivityFolderInDriveResponse = await deleteActivityFolder({ id: activity.descriptionFileDir as string })
        if (deleteActivityFolderInDriveResponse.isLeft())
            return await editErrorReply({
                error: deleteActivityFolderInDriveResponse.value.error, interaction, title: `Erro ao remover a atividade ${activityName} do Google Drive`
            })

        return await editSucessReply({
            interaction, title: `Atividade '${activityName}' removida com sucesso!`
        });
    }
});











