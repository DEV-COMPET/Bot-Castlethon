import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { makeErrorEmbed } from "../embed/makeErrorEmbed"

interface EditErrorReplyRequest {
    error: Error
    interaction: ExtendedModalInteraction
    title: string
}

export async function editErrorReply({ error, interaction, title }: EditErrorReplyRequest) {
    console.error(error)
    return await interaction.editReply({
        embeds: [
            makeErrorEmbed({
                title, interaction,
                error: { code: 401, message: error.message },
            })
        ]
    })
}