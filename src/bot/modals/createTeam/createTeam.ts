import { TextInputComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { makeModal } from "@/bot/utils/modal/makeModal"
import commandData from "@/bot/commands/team/createTeam/createTeamData.json"
import modalData from "./createTeamInputs.json"
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { extractInputData } from "./utils/extractInputData";
import { createRole } from "./utils/createRole";
import { teamColor } from "@/bot/selectMenus/createTeam/variables/color";
import { createRoleChats } from "./utils/createRoleChats";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

const { inputFields }: { inputFields: TextInputComponentData[] } = modalData

const createTeamModal = makeModal({
    inputFields,
    modalBuilderRequestData: {
        customId: commandData.name,
        title: commandData.description
    }
});

export default new Modal({
    customId: commandData.name,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const { institution, name } = extractInputData({ interaction, inputFields })

        await editLoadingReply({ interaction, title: `(1/3) Salvando o time no banco de dados` })

        // const addTeamToDBReponse = await addTeamToDB({ institution, name })
        const addTeamToDBReponse = await fetchDataFromAPI({ json: true, method: "post", url: "/team/", bodyData: { institution, name } })
        if (addTeamToDBReponse.isLeft())
            return await errorReply({
                error: addTeamToDBReponse.value.error,
                interaction, title: "Não foi possivel criar o time"
            })

        await editLoadingReply({ interaction, title: `(2/3) Criando o cargo do time` })

        const createRoleResponse = await createRole({ interaction, name, color: teamColor[teamColor.length - 1] })
        if (createRoleResponse.isLeft())
            return await errorReply({
                error: createRoleResponse.value.error,
                interaction, title: "Não foi possivel criar o cargo relacionado ao time"
            })

        const createRoleChatsResponse = await createRoleChats({ interaction, name, role: createRoleResponse.value.role })
        if (createRoleChatsResponse.isLeft())
            return await errorReply({
                error: createRoleChatsResponse.value.error,
                interaction, title: "Não foi possivel criar os chats do time"
            })

        await editSucessReply({
            interaction, title: "Time criado com Sucesso!!",
            fields: [
                { name: "Nome", value: name, inline: true },
                { name: "Instituição", value: institution, inline: true },
                { name: "Cor do Time", value: teamColor[teamColor.length - 1], inline: true }
            ]
        })
    }
});

export { createTeamModal };
