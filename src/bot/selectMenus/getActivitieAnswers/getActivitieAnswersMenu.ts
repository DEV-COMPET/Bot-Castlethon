import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from './getActivitieAnswersMenuData.json'
import { getLastResponseMeta } from "./utils/getLastResponseMeta";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { uploadMetaToFolder } from "@/bot/utils/googleAPI/googleDrive/uploadMetaToFolder";
import { saveAnswerOnDB } from "./utils/saveAnswerOnDB";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { listChannels } from "./utils/listChannels";

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true });

        const activityName = interaction.values[0] as string

        const listChannelsResponse = await listChannels({ activityName });
        if (listChannelsResponse.isLeft())
            return await editErrorReply({
                error: listChannelsResponse.value.error,
                interaction, title: "Erro ao listar os canais a serem iterados."
            })

        listChannelsResponse.value.channels.forEach(async (channel) => {

            const getLastResponseMetaResponse = await getLastResponseMeta({ interaction, refferenceMessageId: channel.messsageId });
            if (getLastResponseMetaResponse.isLeft())
                return await editErrorReply({
                    error: getLastResponseMetaResponse.value.error,
                    interaction, title: "Erro ao pegar os arquivos do discord."
                })

            const { media, fileName, teamName } = getLastResponseMetaResponse.value;

            const saveAnswerOnDBResponse = await saveAnswerOnDB({ activityName, teamName });
            if (saveAnswerOnDBResponse.isLeft())
                return await editErrorReply({
                    error: saveAnswerOnDBResponse.value.error,
                    interaction, title: "Erro ao salvar a resposta no banco de dados."
                })

            const uploadToFolderResponse = await uploadMetaToFolder({ media, fileName });
            if (uploadToFolderResponse.isLeft()) {
                return await editErrorReply({
                    error: uploadToFolderResponse.value.error,
                    interaction, title: "Erro ao upar os arquivos no drive."
                })
            }
        })

        await editSucessReply({
            interaction, title: "Arquivo enviado com sucesso!"
        });

    }
});











