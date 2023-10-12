import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { Role, VoiceChannel, TextChannel, ChannelType, CategoryChannel } from "discord.js";

interface CreateRoleChatsRequest {
    name: string,
    interaction: ExtendedModalInteraction
    role: Role
}

type CreateRoleChatsResponse = Either<
    { error: DiscordError },
    {
        role: Role;
        category: CategoryChannel;
        voiceChannel: VoiceChannel;
        textChannel: TextChannel;
    }
>

export async function createRoleChats({ interaction, name, role }: CreateRoleChatsRequest): Promise<CreateRoleChatsResponse> {
    const guild = interaction.guild;

    if (!guild) {
        return left({
            error: new DiscordError("Esse comando só pode ser usado em um servidor (Erro de Guild)")
        });
    }

    const category: CategoryChannel = await guild.channels.create({
        name, permissionOverwrites: [
            {
                id: guild.id,
                deny: ['ViewChannel']
            },
            {
                id: role.id,
                allow: ['ViewChannel']
            }
        ],
        type: ChannelType.GuildCategory
    })
    if (!category)
        return left({ error: new DiscordError(`Erro ao criar a categoria do time ${name}`) });

    const voiceChannel: VoiceChannel = await guild.channels.create({
        name,
        type: ChannelType.GuildVoice,
        parent: category,
        permissionOverwrites: [
            {
                id: guild.id,
                deny: ['ViewChannel'],
            },
            {
                id: role.id,
                allow: ['ViewChannel'],
            },
        ],
    });
    if (!voiceChannel)
        return left({ error: new DiscordError(`Erro ao criar o canal de voz do time ${name}`) });

    const textChannel: TextChannel = await guild.channels.create({
        name,
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
            {
                id: guild.id,
                deny: ['ViewChannel'],
            },
            {
                id: role.id,
                allow: ['ViewChannel'],
            },
        ],
    });
    if (!textChannel)
        return left({ error: new DiscordError(`Erro ao criar o canal de voz do time ${name}`) });

    return right({ role, category, voiceChannel, textChannel });
}