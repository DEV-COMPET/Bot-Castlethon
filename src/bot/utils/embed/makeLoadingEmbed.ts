import { readJsonFileRequest } from "../json";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { makeEmbed } from "./makeEmbed";
import { APIEmbedField, EmbedAssetData } from "discord.js";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";

export interface makeEmbedRequest {
    json?: readJsonFileRequest
    interaction: ExtendedModalInteraction | ExtendedInteraction | ExtendedStringSelectMenuInteraction
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
                url: "https://cdn.idevie.com/wp-content/uploads/2014/09/0e59a_resources_cool-loading-animated-gif-3.gif",
            },
            fields,
            description,
            image: url_imagem ? { url: url_imagem } as EmbedAssetData : undefined
        },
        json
    });
}