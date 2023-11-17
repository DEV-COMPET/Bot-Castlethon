import { TextInputComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { makeModal } from "@/bot/utils/modal/makeModal"
import commandData from "@/bot/commands/activity/createActivity/createActivityData.json"
import modalData from "./createActivityInputs.json"
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { extractInputData } from "./utils/extractInputData";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { createFolder } from "@/bot/utils/googleAPI/googleDrive/createFolder";
import { env } from "@/env";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

const { inputFields }: { inputFields: TextInputComponentData[] } = modalData

const createActivityModal = makeModal({
    inputFields,
    modalBuilderRequestData: {
        customId: commandData.name,
        title: commandData.description
    }
});

export default new Modal({
    customId: commandData.name,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true });

        const { name, description } = extractInputData({ interaction, inputFields })

        await editLoadingReply({ interaction, title: "(1/2) Criando espaço no Google Drive...." })

        const createActivitysFolderInDriveResponse = await createFolder({ folderName: name, parentFolderId: env.DRIVE_ACTIVITIES_FOLDER_ID })
        if (createActivitysFolderInDriveResponse.isLeft())
            return await errorReply({
                error: createActivitysFolderInDriveResponse.value.error,
                interaction, title: "Não foi possivel cirar a pasta da atividade no drive"
            })

        await editLoadingReply({ interaction, title: "(2/2) Salvando no DB...." })

        const addActivityToDBReponse = await fetchDataFromAPI({
            json: true, method: "POST", url: "/activity",
            bodyData: { name, description, descriptionFileDir: createActivitysFolderInDriveResponse.value.folderId }
        })
        if (addActivityToDBReponse.isLeft())
            return await errorReply({
                error: addActivityToDBReponse.value.error,
                interaction, title: `Não foi possivel criar a atividade ${name} no banco de dados`
            })

        return await editSucessReply({
            interaction, title: `Atividade '${name}' criada com sucesso!!`,
            fields: [
                { name: "Nome", value: name, inline: true },
                { name: "Descrição", value: description ?? "", inline: true },
            ]
        })
    }
});

export { createActivityModal };
