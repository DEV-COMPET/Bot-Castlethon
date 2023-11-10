import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./sendFileData.json";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { uploadMetaToFolder } from "@/bot/utils/googleAPI/googleDrive/uploadMetaToFolder";
import { getLastResponseMeta } from "./utils/getLastResponseMeta";
import { saveAnswerOnDB } from "./utils/saveAnswerOnDB";

export default new Command({
    name,
    description,

    run: async function ({ interaction }) {

        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        const getLastResponseMetaResponse = await getLastResponseMeta({ interaction, refferenceMessageId: "1172268770824298568" })
        if (getLastResponseMetaResponse.isLeft())
            return await editErrorReply({
                error: getLastResponseMetaResponse.value.error,
                interaction, title: "Erro ao pegar os arquivos do discord."
            })

        const { media, fileName } = getLastResponseMetaResponse.value;
        const uploadToFolderResponse = await uploadMetaToFolder({ media, fileName });
        if (uploadToFolderResponse.isLeft()) {
            return await editErrorReply({
                error: uploadToFolderResponse.value.error,
                interaction, title: "Erro ao upar os arquivos no drive."
            })
        }

        const saveAnswerOnDBResponse = await saveAnswerOnDB({
            activityName: "Atividade 1", teamName: "team1",
        });
        if(saveAnswerOnDBResponse.isLeft()) 
            return await editErrorReply({
                error: saveAnswerOnDBResponse.value.error,
                interaction, title: "Erro ao salvar a resposta no banco de dados."
            })
        

        await editSucessReply({
            interaction, title: "Arquivo enviado com sucesso!"
        });
    },
});
