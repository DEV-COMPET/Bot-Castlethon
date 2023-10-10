import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { Role } from "discord.js";

interface CreateRoleRequest {
    name: string,
    interaction: ExtendedModalInteraction
}

type CreateRoleResponse = Either<
    { error: DiscordError },
    { role: Role }
>

export async function createRole({ interaction, name }: CreateRoleRequest): Promise<CreateRoleResponse> {

    const guild = interaction.guild;

    if (!guild)
        return left({
            error: new DiscordError("Esse comando so pode ser usado em um server (Erro de Guild)")
        })

    const role = await guild.roles.create({
        name,
        color: "Aqua"
    })
    if (!role)
        return left({
            error: new DiscordError("Erro an criação do Cargo")
        })

    return right({ role })

}