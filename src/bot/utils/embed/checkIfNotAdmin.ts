import { Either, left, right } from "@/api/@types/either";
import { IsAdminError } from "@/bot/errors/notAdminError";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { EmbedBuilder, InteractionResponse } from "discord.js";

type CheckIfNotAdminResponse = Either<
    IsAdminError,
    { response: InteractionResponse<boolean> }
>

/**
 * @author Henrique de Paula Rodrigues
 * @description Verifica se o usuário responsável pela interação possui privilégios de Admin
 * @returns {Promise<CheckIfNotAdminResponse>} Erro ou Response do Discord 
 */
export async function checkIfNotAdmin(interaction: ExtendedInteraction | ExtendedModalInteraction): Promise<CheckIfNotAdminResponse> {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const isADM = member?.permissions.has("Administrator");

    if (isADM)
        return left(new IsAdminError())

    const embed = new EmbedBuilder()
        .setColor(0xf56565)
        .setTitle("Não foi possível utilizar este comando!")
        .setDescription("Você não possui autorização necessária.")
        .setThumbnail(
            "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
        )
        .addFields(
            { 
                name: "Código do erro", 
                value: "401", 
                inline: false 
            },
            {
                name: "Mensagem do erro",
                value:
                    "Você precisa ter permissão de administrador para executar esse comando",
                inline: false,
            }
        );

    const response = await interaction.reply({
        content: "Não foi possível executar este comando",
        ephemeral: true,
        embeds: [embed],
    });

    return right({ response })

}

export async function makeNotAdminEmbed(interaction: ExtendedInteraction | ExtendedModalInteraction) {
    const embed = new EmbedBuilder()
        .setColor(0xf56565)
        .setTitle("Não foi possível utilizar este comando!")
        .setDescription("Você não possui autorização necessária.")
        .setThumbnail(
            "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png"
        )
        .addFields(
            { name: "Código do erro", value: "401", inline: false },
            {
                name: "Mensagem do erro",
                value:
                    "Você precisa ter permissão de administrador para executar esse comando",
                inline: false,
            }
        );

    const response = await interaction.reply({
        content: "Não foi possível executar este comando",
        ephemeral: true,
        embeds: [embed],
    });

    return response
}