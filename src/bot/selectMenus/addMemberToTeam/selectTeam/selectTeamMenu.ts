import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./selectTeamMenuData.json"
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { MemberData } from "@/bot/commands/createMember/createMember";
import { createSelectMemberToBeAddedMenu } from "./utils/createTeamsMenu";
import { teamChosen } from "./variables/teamChosen";

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {

        console.log("Aqui")

        const teamName = interaction.values[0]

        teamChosen.push(teamName)

        const guild = interaction.guild;

        if (!guild) {
            return await errorReply({
                error: new Error(), interaction, title: "This command can only be used in a server."
            });
        }

        const members = await guild.members.fetch();

        const membersData: MemberData[] = members.map(member => {

            const { id, globalName, username, } = member.user;

            return {
                id,
                nickName: globalName ?? "", // Provide a default value if globalName is null
                username,
                avatarURL: ""
            };
        });

        const selectMemberToBeAddedMenu = createSelectMemberToBeAddedMenu({ membersData })

        await interaction.reply({
            content: `Time selecionado: ${teamName}\nMembros disponiveis:`,
            components: [await makeStringSelectMenuComponent(selectMemberToBeAddedMenu)],
            ephemeral: true,
        })

    }
});
