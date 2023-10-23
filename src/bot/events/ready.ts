import { Event } from "../structures/Event";

export default new Event("ready", "once", async function () {
  console.log("Bot is ready");
});
