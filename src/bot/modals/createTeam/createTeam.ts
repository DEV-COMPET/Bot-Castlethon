import { TextInputComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { makeModal } from "@/bot/utils/modal/makeModal"
import commandData from "@/bot/commands/createTeam/createTeamData.json"
import modalData from "./createTeamInputs.json"
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { sucessReply } from "@/bot/utils/discord/editSucessReply";
import { extractInputData } from "./utils/extractInputData";
import { addTeamToDB } from "./utils/addTeamToDB";
import { createRole } from "./utils/createRole";
import { teamColor } from "@/bot/selectMenus/createTeam/variables/color";

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

        const { institution, name } = extractInputData({ interaction, inputFields })

        const addTeamToDBReponse = await addTeamToDB({ institution, name })
        if (addTeamToDBReponse.isLeft())
            return await errorReply({
                error: addTeamToDBReponse.value.error,
                interaction, title: "Não foi possivel criar o time"
            })

        const createRoleResponse = await createRole({ interaction, name, color: teamColor[teamColor.length - 1] })
        if (createRoleResponse.isLeft())
            return await errorReply({
                error: createRoleResponse.value.error,
                interaction, title: "Não foi possivel criar o cargo relacionado ao time"
            })

        await sucessReply({
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
