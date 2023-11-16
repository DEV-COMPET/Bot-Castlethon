// Command Interaction
import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./createMemberData.json";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { MemberType } from "@/api/modules/members/entities/member.entity";
import { menuAddOption } from "@/bot/utils/discord/makeSelectMenu";
import { selectMemberMenu } from "@/bot/selectMenus/createMember/selectMemberMenu";

export interface MemberData {
    id: string,
    nickName: string,
    username: string
    avatarURL: string
}

export default new Command({
    name,
    description,
    run: async function ({ interaction }) {

        // Step 1: Defer the reply
        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        const guild = interaction.guild;

        if (!guild) {
            return await editErrorReply({
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

        //const getNotAddedMembersResponse = await getNotAddedMembers({ membersData })
        const getNotAddedMembersResponse = await fetchDataFromAPI({
            json: true, method: "get", url: "/member/"
        })
        if (getNotAddedMembersResponse.isLeft()) {
            return await editErrorReply({
                error: getNotAddedMembersResponse.value.error,
                interaction,
                title: "Failed to get not added members."
            });
        }

        const addedMembers: MemberType[] = getNotAddedMembersResponse.value.responseData;
        const addableMembers = membersData.filter(memberData => memberData.id !== addedMembers.find(addedMember => addedMember.discord_id === memberData.id)?.discord_id);

        if (addableMembers.length === 0) {
            return await editErrorReply({
                error: new Error(),
                interaction,
                title: "There are no members to add."
            });
        }

        const menu = menuAddOption({
            menu: selectMemberMenu, optionData: addableMembers.map(memberData => {
                const { id, nickName, username } = memberData;
                return {
                    label: `${username} (${nickName})`,
                    value: id
                }
            }),
        })
        if (menu.isLeft()) {
            return await editErrorReply({
                error: menu.value.error, interaction, title: "Failed to create menu."
            });
        }

        return await interaction.editReply({
            content: "Usuarios Disponíveis:",
            components: [menu.value.menu],
        });
    },
});
