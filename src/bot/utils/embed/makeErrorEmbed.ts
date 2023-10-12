import { readJsonFileRequest } from "../json";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { makeEmbed } from "./makeEmbed";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";

export interface makeEmbedRequest {
    json?: readJsonFileRequest
    interaction: ExtendedModalInteraction | ExtendedInteraction | ExtendedStringSelectMenuInteraction
    error: {
        code: number,
        message: string
    }
    title?: string
}

export function makeErrorEmbed({ interaction, error, json, title }: makeEmbedRequest) {

    return makeEmbed({
        data: {
            title: title ? title : "Não foi possível completar essa ação!",
            color: 0xf56565,
            author: {
                name: interaction.user.username.replaceAll("_", " ") || "abc",
                iconURL: interaction.user.avatarURL() || undefined,
            },
            thumbnail: {
                url: "https://www.pngfind.com/pngs/m/0-1420_red-cross-mark-clipart-green-checkmark-red-x.png",
            },
            fields: [
                {
                    name: "Código do erro",
                    value: error.code.toString(),
                    inline: false,
                },
                {
                    name: "Mensagem do erro",
                    value: error.message,
                    inline: false,
                },
            ],
        },
        json
    });

}
