import fetch from "node-fetch";
import { client } from "..";
import { Event } from "../structures/Event";
import { env } from "@/env";

export default new Event("ready", "once", async function () {
  let webhook = client.webhook;
  if (!webhook) {
    await client.createWebhook({
      channelName: "geral",
      webhookName: "Autentique Webhook",
    });
    webhook = client.webhook;
  }
  if (!webhook) return;
  try {
    const url = env.ENVIRONMENT === "development" ? "http://localhost:4444" : env.HOST;
    const response = await fetch(`${url}/webhooks/discord/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: webhook.name,
        id: webhook.id,
        token: webhook.token,
        guildId: webhook.guildId,
      }),
    });
    const data = await response.json();
  } catch (error) {
    console.error(error);
  }
});
