import { GuildMember, StringSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedStringSelectMenuInteraction extends StringSelectMenuInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedStringSelectMenuInteraction;
}

type RunFunction = (options: RunOptions) => any;

export type StringSelectMenuType = {
  customId: string;
  run: RunFunction;
};
