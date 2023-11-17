import { Either, left, right } from "@/api/@types/either";
import { RoleData } from "@/bot/commands/team/deleteTeam/utils/getTeamNamesInDiscordRoles";
import { DiscordError } from "@/bot/errors/discordError";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";
import { ChannelType } from "discord.js";

interface RemoveTeamFromDiscordRequest {
    roleData: RoleData
    interaction: ExtendedStringSelectMenuInteraction
}

type RemoveTeamFromDiscordResponse = Either<
    { error: DiscordError },
    { name: string }
>

export async function removeTeamFromDiscord({ roleData, interaction }: RemoveTeamFromDiscordRequest): Promise<RemoveTeamFromDiscordResponse> {

    const { categoryName, roleName, textChannelName, voiceChannelName } = roleData

    const guild = interaction.guild;

    if (!guild) {
        return left({
            error: new DiscordError("Esse comando só pode ser usado em um servidor (Erro de Guild)")
        });
    }

    if (!roleName && !categoryName && !textChannelName && !voiceChannelName)
        return left({ error: new DiscordError("Nenhum dos nomes passados é valido 1") });

    if (roleName) {

        await editLoadingReply({ interaction, title: `1. Removendo Cargo` })

        const role = guild.roles.cache.find((role) => role.name.toLowerCase() === roleName)
        if (!role)
            return left({ error: new DiscordError(`Cargo "${roleName}" não encontrado`) });

        await role.delete();
    }

    if (categoryName) {

        await editLoadingReply({ interaction, title: `2. Removendo categoria` })

        const category = guild.channels.cache.find(
            (channel) => channel.type === ChannelType.GuildCategory && channel.name.toLowerCase() === categoryName
        );

        if (!category)
            return left({ error: new DiscordError(`Categoria "${categoryName}" não encontrada`) });

        await category.delete();
    }

    if (voiceChannelName) {

        await editLoadingReply({ interaction, title: `3. Removendo canal de Voz` })

        const category = guild.channels.cache.find(
            (channel) => channel.type === ChannelType.GuildVoice && channel.name.toLowerCase() === voiceChannelName
        );

        if (!category)
            return left({ error: new DiscordError(`Canal de voz "${voiceChannelName}" não encontrado`) });

        await category.delete();
    }

    if (textChannelName) {

        await editLoadingReply({ interaction, title: `4. Removendo canal de Texto` })

        const category = guild.channels.cache.find(
            (channel) => channel.type === ChannelType.GuildText && channel.name.toLowerCase().replaceAll('-', ' ') === textChannelName
        );

        if (!category)
            return left({ error: new DiscordError(`Canal de texto "${textChannelName}" não encontrado`) });

        await category.delete();
    }

    return right({ name: roleName ?? categoryName ?? textChannelName ?? voiceChannelName ?? "Nenhum dos nomes passados é valido 2" });
}