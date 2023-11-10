import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import axios from 'axios';
import mime from 'mime-types';

type GetLastResponseMetaResponse = Either<
    { error: DiscordError },
    { media: any, fileName: string, teamName: string }
>

interface GetLastResponseMetaRequest {
    interaction: ExtendedInteraction,
    refferenceMessageId: string
}

export async function getLastResponseMeta({ interaction, refferenceMessageId }: GetLastResponseMetaRequest): Promise<GetLastResponseMetaResponse> {

    const channel = await interaction.channel?.fetch();
    const messages = await channel?.messages.fetch()
    if (!messages)
        return left({ error: new DiscordError("Não há mensagens no canal") })

    const filteredMessages = messages
        .filter(message => message.attachments.size > 0)
        .filter(message => message.reference?.messageId === refferenceMessageId)

    const lastMessage = filteredMessages.first();
    if (!lastMessage)
        return left({ error: new DiscordError("Não há mensagens no canal") })

    const attachment = lastMessage.attachments.first();
    if (!attachment)
        return left({ error: new DiscordError("Não há mensagens no canal") })

    const response = await axios.get(attachment.url, { responseType: 'stream' });
    const mimeType = mime.lookup(attachment.name) || 'application/octet-stream';
    const media = {
        mimeType,
        body: response.data,
    };

    const authorId = lastMessage.author.id;
    const authorRole = interaction.guild?.members.cache.get(authorId)?.roles.highest.name;

    return right({ media: media, fileName: attachment.name, teamName: authorRole || "Sem time" })
}

/*
if (attachment) {
    const response = await axios.get(attachment.url, { responseType: 'stream' });
    const filePath = `./downloads/${attachment.name}`;
    const writer = fs.createWriteStream(filePath);
    await response.data.pipe(writer);
    writer.on('finish', () => consoleattachment
*/