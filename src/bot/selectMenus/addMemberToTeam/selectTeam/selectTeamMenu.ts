import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId, minMax } from "./selectTeamMenuData.json"
import { errorReply } from "@/bot/utils/discord/editErrorReply";
import { MemberData } from "@/bot/commands/member/createMember/createMember";
import { teamChosen } from "./variables/teamChosen";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { MemberType } from "@/api/modules/members/entities/member.entity";
import { selectMemberToBeAddedMenu } from "../selectMember/selectMemberMenu";
import { makeSelectMenu, menuAddOption } from "@/bot/utils/discord/makeSelectMenu";

export const selectTeamMenu = makeSelectMenu({
    customId, max: minMax.max, min: minMax.min,
})

export default new SelectMenu({
    customId,

    run: async ({ interaction }) => {

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

        // const availableMembers = await getAvailableMembers({ membersData })
        const availableMembers = await fetchDataFromAPI({ json: true, method: "get", url: `/member/` })
        if (availableMembers.isLeft()) {
            return await errorReply({
                error: availableMembers.value.error, interaction, title: "Erro ao buscar membros disponiveis"
            });
        }

        const addedMembers: MemberType[] = await availableMembers.value.responseData;
        const addableMembers = membersData
            .filter(memberData => memberData.id === addedMembers
                .find(addedMember => addedMember.discord_id === memberData.id)?.discord_id);

        if (addableMembers.length === 0) {
            return await errorReply({
                error: new Error(), interaction, title: "Nenhum membro disponivel"
            });
        }

        const makeMenuResponse = menuAddOption({
            menu: selectMemberToBeAddedMenu, optionData: addableMembers.map(member => {
                return {
                    label: `${member.username} (${member.nickName})`,
                    value: member.id
                }
            })
        })
        if (makeMenuResponse.isLeft()) {
            return await errorReply({
                error: makeMenuResponse.value.error, interaction, title: "Erro ao adicionar membros no menu"
            });
        }

        await interaction.reply({
            content: `Time selecionado: ${teamName}\nMembros disponiveis:`,
            components: [makeMenuResponse.value.menu],
            ephemeral: true,
        })

    }
});
