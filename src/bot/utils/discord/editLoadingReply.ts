import { ExtendedModalInteraction } from "@/bot/typings/Modals"
import { makeLoadingEmbed } from "../embed/makeLoadingEmbed"

interface EditLoadingReplyRequest {
    interaction: ExtendedModalInteraction
    title: string
}

export async function editLoadingReply({ interaction, title }: EditLoadingReplyRequest) {
    await interaction.editReply({
        embeds: [
            makeLoadingEmbed({
                title, interaction,
            })
        ]
    })
}