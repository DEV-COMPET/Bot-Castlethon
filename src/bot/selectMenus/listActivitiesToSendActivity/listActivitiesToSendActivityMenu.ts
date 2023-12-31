import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from './listActivitiesToSendActivityMenuData.json'
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { ChannelType } from "discord.js";
import { makeSuccessEmbed } from "@/bot/utils/embed/makeSuccessEmbed";
import { ActivityMessage, ActivityType } from "@/api/modules/activities/entities/activity.entity";
import { fetchDataFromAPI } from "@/bot/utils/fetch/fetchData";
import { TeamType } from "@/api/modules/teams/entities/team.entity";
import { editLoadingReply } from "@/bot/utils/discord/editLoadingReply";

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const activityName = interaction.values[0] as string

        await editLoadingReply({ interaction, title: "(1/3) Carregando dados da atividade..." })

        const fetchDataFromAPIResponse = await fetchDataFromAPI({ json: true, method: "GET", url: `/activity/${activityName}` })
        if (fetchDataFromAPIResponse.isLeft())
            return await editErrorReply({
                error: fetchDataFromAPIResponse.value.error, interaction, title: "Erro ao pegar a atividade"
            })

        const activity = fetchDataFromAPIResponse.value.responseData as ActivityType

        const guild = interaction.guild;
        if (!guild)
            return await editErrorReply({
                error: new Error("Guild não encontrada"), interaction, title: "Erro ao pegar a guild"
            })

        await editLoadingReply({ interaction, title: "(2/3) Selecionando canais para divulgação..." })

        // const getTeamsTextChannelsResponse = await getTeamsTextChannels();
        const getTeamsTextChannelsResponse = await fetchDataFromAPI({ json: true, method: "GET", url: `/team/` })
        if (getTeamsTextChannelsResponse.isLeft())
            return await editErrorReply({
                error: getTeamsTextChannelsResponse.value.error, interaction, title: "Erro ao pegar os canais de texto"
            })

        const teams = getTeamsTextChannelsResponse.value.responseData as TeamType[]
        const teamsTextChannels = teams
            .map(team => team.name
                .toLowerCase()
                .replace(/\s/g, "-"))
        const teamsDiscordTextChannels = guild.channels.cache
            .filter(channel => teamsTextChannels.includes(channel.name))

        await editLoadingReply({ interaction, title: "(3/3) Divulgando!!" })

        const messagesIds = await Promise.all(
            teamsDiscordTextChannels.map(async (channel) => {
                if (channel.type === ChannelType.GuildText) {
                    const message = await channel.send({
                        embeds: [
                            makeSuccessEmbed({
                                interaction,
                                title: activity.name,
                                description: activity.description,
                            }),
                        ],
                    });

                    return {
                        messsageId: message.id,
                        textChannelName: channel.name
                    } as ActivityMessage
                }
            }));
        if (!messagesIds)
            return await editErrorReply({
                error: new Error("Não foi possível enviar as mensagens"), interaction, title: "Erro ao enviar as mensagens"
            })

        const storeActivitiesMessagesResponse = await fetchDataFromAPI({
            json: true,
            method: "PUT",
            url: `/activity/messages`,
            bodyData: {
                messagesData: messagesIds,
                activityName: activity.name
            }
        })
        if (storeActivitiesMessagesResponse.isLeft())
            return await editErrorReply({
                error: storeActivitiesMessagesResponse.value.error, interaction, title: "Erro ao salvar as mensagens no DB"
            })

        return await editSucessReply({
            interaction, title: "Mensagens enviadas com sucesso!",
        });
    }
});











