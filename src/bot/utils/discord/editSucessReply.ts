import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { makeSuccessEmbed } from "../embed/makeSuccessEmbed"
import { APIEmbedField } from "discord.js"

interface EditSucessReplyRequest {
    interaction: ExtendedModalInteraction
    title: string
    fields?: APIEmbedField[]
    url_imagem?: string
}

export async function editSucessReply({ interaction, title, fields, url_imagem }: EditSucessReplyRequest) {
    return await interaction.editReply({
        embeds: [
            makeSuccessEmbed({
                title,
                interaction,
                fields,
                url_imagem
            })
        ]
    })
}