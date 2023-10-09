import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./selectMemberMenuData.json"
import { selectedUserData } from "./variables/userData";
import { createMemberModal } from "@/bot/modals/createMember/createMember";
import { Guild, GuildMember } from "discord.js";

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

        // const [username, nickName, id, avatarURL] = interaction.values[interaction.values.length - 1]
        //     .split(" || ")
        //     .map(value => value.trim());

        selectedUserData.push({ id, nickName, username, avatarURL })

        await interaction.showModal(createMemberModal)
    }
});
