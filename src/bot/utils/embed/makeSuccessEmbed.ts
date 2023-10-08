import { readJsonFileRequest } from "../json";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { makeEmbed } from "./makeEmbed";
import { APIEmbedField, EmbedAssetData } from "discord.js";
import { ExtendedInteraction } from "@/bot/typings/Commands";

export interface makeEmbedRequest {
    json?: readJsonFileRequest
    interaction: ExtendedModalInteraction | ExtendedInteraction
    description?: string 
    title?: string
    fields?: APIEmbedField[]
    url_imagem?: string 
}

export function makeSuccessEmbed({ interaction, description, json, title, fields, url_imagem }: makeEmbedRequest) {

    return makeEmbed({
        data: {
            title: title ? title : "Ação realizada com sucesso!",
            color: 1683593,
            author: {
                name: interaction.user.username.replaceAll("_", " ") || "abc",
                iconURL: interaction.user.avatarURL() || undefined,
            },
            thumbnail: {
                url: "https://www.pngfind.com/pngs/m/0-226_image-checkmark-green-check-mark-circle-hd-png.png",
            },
            fields,
            description,
            image: url_imagem ? { url: url_imagem } as EmbedAssetData : undefined
        },
        json
    });
}