import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax} from "./selectMemberMenuData.json"
import { selectedUserData } from "./variables/userData";
import { createMemberModal } from "@/bot/modals/createMember/createMember";
import { Guild, GuildMember } from "discord.js";
import { makeSelectMenu } from "@/bot/utils/discord/makeSelectMenu";

export const selectMemberMenu = makeSelectMenu({
    customId, max: minMax.max, min: minMax.min,
})

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        const guild = interaction.guild as Guild

        const members = await guild.members.fetch();

        const id = interaction.values[0] as string

        const correctMember = members.find((member) => member.id === id) as GuildMember

        const username = correctMember.user.username
        const nickName = correctMember.user.globalName || ""
        const avatarURL = correctMember.user.displayAvatarURL()

        selectedUserData.push({ id, nickName, username, avatarURL })

        await interaction.showModal(createMemberModal)
    }
});
