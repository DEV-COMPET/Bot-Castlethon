import { GuildMember, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedModalInteraction extends ModalSubmitInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedModalInteraction;
}

type RunFunction = (options: RunOptions) => any;

export type ModalType = {
  customId: string;
  run: RunFunction;
};
