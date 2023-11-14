import { Either, left, right } from "@/api/@types/either";
import { DiscordError } from "@/bot/errors/discordError";
import { ExtendedInteraction } from "@/bot/typings/Commands";
import { Colors } from "discord.js";

interface CreateRoleRequest {
    interaction: ExtendedInteraction
}

type CreateRoleResponse = Either<
    { error: DiscordError },
    { colors: ColorWithNameStr[] }
>

export async function getAllRolesColors({ interaction }: CreateRoleRequest): Promise<CreateRoleResponse> {

    const guild = interaction.guild;

    if (!guild)
        return left({
            error: new DiscordError("Esse comando so pode ser usado em um server (Erro de Guild)")
        })

    const allCollors: ColorWithNameStr[] = getColorList();

    const excludedColorNames = ['Default', 'LuminousVividPink', 'Grey', 'DarkGrey', 'DarkerGrey', 'LightGrey'];

    const allCollorsNew: ColorWithNameStr[] = Array.from(allCollors).filter((color) =>
        !guild.roles.cache.some((role) =>
            color.hexCode === role.color.toString() || excludedColorNames.includes(color.name)
        )
    );

    return right({ colors: allCollorsNew })
}

type ColorWithNameStr = {
    name: string;
    hexCode: string;
};

function getColorList(): ColorWithNameStr[] {
    const colorKeys = Object.keys(Colors);

    const colorList = colorKeys.map(colorName => {
        const hexCode = Colors[colorName as keyof typeof Colors];
        return { name: colorName, hexCode: hexCode.toString() };
    })

    return colorList;
}