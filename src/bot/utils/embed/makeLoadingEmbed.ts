import { readJsonFileRequest } from "../json";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { makeEmbed } from "./makeEmbed";
import { APIEmbedField, EmbedAssetData } from "discord.js";

export interface makeEmbedRequest {
    json?: readJsonFileRequest
    interaction: ExtendedModalInteraction
    description?: string 
    title?: string
    fields?: APIEmbedField[]
    url_imagem?: string 
}

export function makeLoadingEmbed({ interaction, description, json, title, fields, url_imagem }: makeEmbedRequest) {

    return makeEmbed({
        data: {
            title: title ? title : "Ação em andamento...",
            color: 49151,
            author: {
                name: interaction.user.username.replaceAll("_", " ") || "abc",
                iconURL: interaction.user.avatarURL() || undefined,
            },
            thumbnail: {
                url: "https://www.pngall.com/wp-content/uploads/14/Loading-PNG-Free-Image.png",
            },
            fields,
            description,
            image: url_imagem ? { url: url_imagem } as EmbedAssetData : undefined
        },
        json
    });
}