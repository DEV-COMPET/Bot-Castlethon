import { CommandType } from "./Commands";

export interface RegisterCommandsOptions {
  guildId?: string;
  // commands: ApplicationCommandDataResolvable[];
}
interface RegisterOptions<T> {
  guildId?: string;
  command: T;
}
export interface RegisterCommandOptions extends RegisterOptions<CommandType> {}
