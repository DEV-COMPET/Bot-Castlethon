import { ComponentType, TextInputComponentData, TextInputStyle } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { makeModal } from "@/bot/utils/modal/makeModal"
import commandData from "@/bot/commands/createMember/createMemberData.json"
import modalData from "./createMemberInputs.json"
import { extractInputData } from "./utils/extractInputData";
import { addMemberToDB } from "./utils/addMemberToDB";
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { sucessReply } from "@/bot/utils/discord/editSucessReply";
import { selectedUserData } from "@/bot/selectMenus/createMember/variables/userData";

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

        const { email, institution, name } = extractInputData({ interaction, inputFields })

        const { nickName, username, id, avatarURL } = selectedUserData[selectedUserData.length - 1] || {};
        const discordName = nickName ? nickName : (username ? username : "");

        const addMemberToDBReponse = await addMemberToDB({
            discord_id: id, discord_username: username, discord_nickname: nickName,
            inputData: { email, institution, name: name || discordName}
        })
        if (addMemberToDBReponse.isLeft())
            return await errorReply({
                error: addMemberToDBReponse.value.error,
                interaction, title: "Não foi possivel cirar o membro"
            })

        return await sucessReply({
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
