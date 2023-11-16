import { editSucessReply } from "@/bot/utils/discord/editSucessReply";
import { Command } from "../../structures/Command";

export default new Command({
  name: 'ping',
  description: "replies with pong",
  run: async ({ interaction }) => {

    await interaction.deferReply({ ephemeral: true })

    console.log("Pong")

    await editSucessReply({
      interaction, title: "Pong", fields: [
        {
          name: "Bot Latency",
          value: `${Date.now() - interaction.createdTimestamp}ms`,
          inline: true
        },
        {
          name: "API Latency",
          value: `${Math.round(interaction.client.ws.ping)}ms`,
          inline: true
        }]
    })
  },
})