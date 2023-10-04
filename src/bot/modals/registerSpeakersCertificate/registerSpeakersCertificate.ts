import { TextInputComponentData, ModalComponentData } from "discord.js";
import { Modal } from "@/bot/structures/Modals";
import { readJsonFile } from "@/bot/utils/json";
import { makeModal } from "@/bot/utils/modal/makeModal"
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { extractInputData } from "./utils/extractInputData";

const { inputFields, modalBuilderRequest }: {
    inputFields: TextInputComponentData[];
    modalBuilderRequest: ModalComponentData;
} = readJsonFile({ dirname: __dirname, partialPath: 'registerSpeakersCertificateData.json' });

const registerSpeakersCertificatesModal = makeModal(inputFields, modalBuilderRequest);

export default new Modal({
    customId: "speakercertificate",

    run: async ({ interaction }) => {

        if (interaction.channel === null)
            throw "Channel is not cached";

        await interaction.deferReply({ ephemeral: true })

        const isNotAdmin = await checkIfNotAdmin(interaction)
        if ((isNotAdmin).isRight())
            return isNotAdmin.value.response

        const { nomes, titulo, data_completa, /*email_assinante,*/ horas, minutos } = extractInputData({ interaction, inputFields })

        return await interaction.editReply({
            embeds: [
                makeSuccessEmbed({
                    title: "Certificados de Palestrantes gerados com sucesso!",
                    fields: [
                        {
                            name: "Nome do Evento",
                            value: `${titulo}`
                        },
                        {
                            name: "Link do Google Drive",
                            value: `https://drive.google.com/drive/folders`
                        }
                    ],
                    interaction
                })
            ]
        })

    }
});

export { registerSpeakersCertificatesModal };
