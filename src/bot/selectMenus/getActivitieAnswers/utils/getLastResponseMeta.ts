import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";
import axios from 'axios';
import { TextChannel } from "discord.js";
import mime from 'mime-types';

export interface FileResponse { fileName: string, media: any }
export interface DriveResponse { link: string }

type GetLastResponseMetaResponse = Either<
    { error: DiscordError },
    {
        answer: {
            data: FileResponse | DriveResponse | null
            type: "FILE" | "DRIVE" | "EMPTY"
        }
        teamName: string
    }
>

interface GetLastResponseMetaRequest {
    interaction: ExtendedStringSelectMenuInteraction,
    refferenceMessageId: string
    channelName: string
}

export async function getLastResponseMeta({ interaction, refferenceMessageId, channelName }: GetLastResponseMetaRequest): Promise<GetLastResponseMetaResponse> {
    console.log("Entrei")
    const channel = (await interaction.guild?.channels.cache.find(channel => channel.name === channelName)?.fetch()) as TextChannel;
    if (!channel)
        return left({ error: new DiscordError(`Não foi possível encontrar o canal ${channelName}`) });

    const messages = await channel.messages.fetch();
    if (!messages)
        return left({ error: new DiscordError("Não há mensagens no canal") });

    const filteredMessages = messages
        .filter((message: any) => message.reference?.messageId === refferenceMessageId);

    const lastMessage = filteredMessages.first();
    if (!lastMessage)
        return right({
            teamName: channel.name.replaceAll("-", " "),
            answer: { type: "EMPTY", data: null }
        })

    const attachment = lastMessage.attachments.first();

    if (attachment) {
        const response = await axios.get(attachment.url, { responseType: 'stream' });
        const mimeType = mime.lookup(attachment.name) || 'application/octet-stream';
        const media = {
            mimeType,
            body: response.data,
        };


        console.log("sai com attatchment")

        return right({
            teamName: channel.name.replaceAll("-", " "),
            answer: { type: "FILE", data: { fileName: attachment.name, media } }
        })
    }

    const escrita = lastMessage.content;

    if (escrita) {

        console.log("sai com escrita")


        return right({
            teamName: channel.name.replaceAll("-", " "),
            answer: { type: "DRIVE", data: { link: escrita } }
        })
    }

    return left({ error: new DiscordError("Resposta em branco => invalida") });
}

/*
if (attachment) {
    const response = await axios.get(attachment.url, { responseType: 'stream' });
    const filePath = `./downloads/${attachment.name}`;
    const writer = fs.createWriteStream(filePath);
    await response.data.pipe(writer);
    writer.on('finish', () => consoleattachment
*/