import { EmbedBuilder, EmbedData } from "discord.js";
import { readJsonFile, readJsonFileRequest } from "../json";

export interface makeEmbedRequest {
    data: EmbedData,
    json?: readJsonFileRequest
}

export function makeEmbed({ data, json }: makeEmbedRequest) {

    let embed: EmbedBuilder;

    if(json) embed = new EmbedBuilder(Object.assign({}, readJsonFile(json), data))
    else     embed = new EmbedBuilder(data)

    embed.setTimestamp()

    return embed
}