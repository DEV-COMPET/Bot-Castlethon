import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { CategoryChannel, ChannelType, TextChannel, VoiceChannel } from "discord.js";

interface GetDiscordTeamDataRequest {
    interaction: ExtendedInteraction
}

export interface RoleData {
    roleName?: string,
    textChannelName?: string,
    voiceChannelName?: string,
    categoryName?: string
}

export interface Role {
    name: string,
    data: RoleData
}

type GetDiscordTeamDataResponse = Either<
    { error: DiscordError },
    { roles: Role[] }
>

export async function getDiscordTeamData({ interaction }: GetDiscordTeamDataRequest): Promise<GetDiscordTeamDataResponse> {

    const guild = interaction.guild;

    if (!guild)
        return left({
            error: new DiscordError("Esse comando so pode ser usado em um server (Erro de Guild)")
        })

    const prohibitedRoleNames = ["@everyone", "Adm"]
    const roleNames = guild.roles.cache
        .filter(role => !role.managed)
        .filter(role => !prohibitedRoleNames.includes(role.name))
        .map(role => role.name.toLowerCase());

    const prohibitedTextChannelNames = ["geral"]
    const textChannelNames = guild.channels.cache
        .filter(channel => channel.type === ChannelType.GuildText)
        .filter(channel => !prohibitedTextChannelNames.includes(channel.name))
        .map(channel => (channel as TextChannel).name.toLowerCase().replaceAll('-', ' '));

    const voiceChannelNames = guild.channels.cache
        .filter(channel => channel.type === ChannelType.GuildVoice)
        .map(channel => (channel as VoiceChannel).name.toLowerCase());

    const categoryNames = guild.channels.cache
        .filter(channel => channel.type === ChannelType.GuildCategory)
        .map(channel => (channel as CategoryChannel).name.toLowerCase());

    const data: Role[] = [];

    for (const roleName of roleNames) {
        const existingRole = data.find(roleData => roleData.name === roleName);

        if (existingRole) {
            existingRole.data.roleName = roleName;
        } else {
            data.push({ name: roleName, data: { roleName } });
        }
    }

    for (const textChannelName of textChannelNames) {
        const existingRole = data.find(roleData => roleData.data.textChannelName === textChannelName);

        if (existingRole) {
            existingRole.data.textChannelName = textChannelName;
        } else {
            data.push({ name: textChannelName, data: { textChannelName } });
        }
    }

    for (const voiceChannelName of voiceChannelNames) {
        const existingRole = data.find(roleData => roleData.data.voiceChannelName === voiceChannelName);

        if (existingRole) {
            existingRole.data.textChannelName = voiceChannelName;
        } else {
            data.push({ name: voiceChannelName, data: { voiceChannelName } });
        }
    }

    for (const categoryName of categoryNames) {
        const existingRole = data.find(roleData => roleData.data.categoryName === categoryName);

        if (existingRole) {
            existingRole.data.textChannelName = categoryName;
        } else {
            data.push({ name: categoryName, data: { categoryName } });
        }
    }

    return right({ roles: data });
}