import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { InvalidInputsError } from "@/bot/errors/invalidInputsError";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";

interface GiveMemberRoleRequest {
    interaction: ExtendedStringSelectMenuInteraction
    memberDiscordId: string
    roleName: string
}

export async function giveMemberRole({ interaction, memberDiscordId, roleName }: GiveMemberRoleRequest): Promise<GiveMemberRoleResponse> {
    const member = interaction.guild?.members.cache.get(memberDiscordId);
    if (!member)
        return left({ error: new InvalidInputsError("Discord Id") })

    const role = interaction.guild?.roles.cache.find((r) => r.name === roleName);
    if (!role)
        return left({ error: new InvalidInputsError("Role Name") })

    try {
        await member.roles.add(role)
    } catch (error) {
        console.error(error)
        return left({ error: new DiscordError('Ocorreu um erro ao atribuir o cargo') })
    }

    return right({ roleName })
}

type GiveMemberRoleResponse = Either<
    { error: InvalidInputsError },
    { roleName: string }
>