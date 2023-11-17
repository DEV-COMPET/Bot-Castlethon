import { ComponentType, TextInputComponentData, TextInputStyle } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { makeModal } from "@/bot/utils/modal/makeModal"
import commandData from "@/bot/commands/member/createMember/createMemberData.json"
import modalData from "./createMemberInputs.json"
import { extractInputData } from "./utils/extractInputData";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { selectedUserData } from "@/bot/selectMenus/createMember/variables/userData";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

const { inputFields }: { inputFields: TextInputComponentData[] } = modalData

const completeInputFields: TextInputComponentData[] = [
    ...inputFields, {
        label: `Usar nome diferente do discord?`,
        placeholder: "Fulano diferente do discord",
        customId: "nome",
        required: false,
        style: TextInputStyle.Short,
        type: ComponentType.TextInput
    }
]

const createMemberModal = makeModal({
    inputFields: completeInputFields, modalBuilderRequestData: {
        customId: commandData.name,
        title: commandData.description
    }
});

export default new Modal({
    customId: commandData.name,

    run: async ({ interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const { email, institution, name } = extractInputData({ interaction, inputFields })

        await editLoadingReply({ interaction, title: `Salvando o usuario no banco de dados` })

        const { nickName, username, id, avatarURL } = selectedUserData[selectedUserData.length - 1] || {};
        const discordName = nickName ? nickName : (username ? username : "");

        //const addMemberToDBReponse = await addMemberToDB({
        //    discord_id: id, discord_username: username, discord_nickname: nickName,
        //    inputData: { email, institution, name: name || discordName }
        //})

        const addMemberToDBResponse = await fetchDataFromAPI({
            json: true, method: "post", url: "/member/",
            bodyData: {
                discord_id: id, discord_username: username, discord_nickname: nickName,
                email, institution, name: name || discordName, role: "USER"
            }
        })
        if (addMemberToDBResponse.isLeft())
            return await editErrorReply({
                error: addMemberToDBResponse.value.error,
                interaction, title: "Não foi possivel cirar o membro"
            })

        return await editSucessReply({
            interaction, title: "Usuario criado com Sucesso!!",
            fields: [
                { name: "Nome", value: name || discordName },
                { name: "Email", value: email },
                { name: "Instituição", value: institution }
            ], url_imagem: avatarURL
        })
    }
});

export { createMemberModal };
