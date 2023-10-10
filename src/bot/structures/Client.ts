import { Client, ClientEvents, Collection, GatewayIntentBits, Routes, REST, Webhook, TextChannel, IntentsBitField } from "discord.js";
import { CommandType } from "../typings/Commands";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import * as path from "path";
import { ModalType } from "../typings/Modals";
import { env } from "@/env";
import { glob } from 'glob'
import { StringSelectMenuType } from "../typings/SelectMenu";

const appId = env.DISCORD_CLIENT_ID;
const token = env.DISCORD_TOKEN;
const rest = new REST({ version: "10" }).setToken(
    env.DISCORD_TOKEN
);
//const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    modals: Collection<string, ModalType> = new Collection();
    selectMenus: Collection<string, StringSelectMenuType> = new Collection();
    webhook?: Webhook;

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages] });
    }

    private async folderFiles(dir: string) {
        const pattern = "**/*{.ts,.js}";
        const directory = path.join(__dirname, "..", dir);
        const dirFiles = await glob(pattern, { cwd: directory });

        //const jsfiles = await glob('**/*.js', { ignore: 'node_modules/**' })

        return { dirFiles, directory }
    }

    private async importFile(filepath: string) {
        return (await import(filepath))?.default;
    }

    async start() {
        await this.registerModules();
        await this.registerModals();
        await this.registerCommands({});
        await this.registerSelectMenus();

        await this.login(token);
    }

    async registerModules() {

        try {
            const { dirFiles, directory } = await this.folderFiles("commands")

            dirFiles.forEach(async (filepath) => {
                const command: CommandType = await this.importFile(
                    path.join(directory, filepath)
                );

                if (!command) return;

                this.commands.set(command.name, command); // armazena em um map o comando e seu nome
            });

        } catch (error) {
            console.error(error);
        }
        // import events 
        try {
            const { dirFiles, directory } = await this.folderFiles("events")

            dirFiles.forEach(async (filepath) => {
                const event: Event<keyof ClientEvents> = await this.importFile(
                    path.join(directory, filepath)
                );
                if (event.typeEvent === "on") this.on(event.event, event.run); // TODO: qual a diferença entre esses
                else this.once(event.event, event.run);
            });
        } catch (error) {
            console.error(error);
        }
    }


    async registerSelectMenus() {
        try {
            const { dirFiles, directory } = await this.folderFiles("selectMenus")

            console.log({ selectMenus: dirFiles });

            dirFiles.forEach(async (filepath) => {

                const selectmenu: StringSelectMenuType = await this.importFile(
                    path.join(directory, filepath)
                );
                if (!selectmenu) {
                    return;
                }
                this.selectMenus.set(selectmenu.customId, selectmenu);
            });

        } catch (error) {
            console.error(error);
        }
    }


    /**
   * Armazena no atributo this.modals os modais (interfaces) a serem utilizados pelos comandos.
   */
    async registerCommands({ guildId }: RegisterCommandsOptions) { // FIXME: nunca é passado um guildId

        const commands = this.commands.map((command) => command); // TODO: por que não só criar um vetor de commands mais cedo

        const { dirFiles } = await this.folderFiles("commands")

        console.log({ commands: dirFiles })

        if (guildId) {
            await rest.put(Routes.applicationGuildCommands(appId, guildId), {
                body: commands,
            });
            await this.guilds.cache.get(guildId)?.commands.set(commands);
        } else {
            await rest.put(Routes.applicationCommands(appId), { body: commands }); // chama requisição de PUT para armazenar comandos
            await this.application?.commands.set(commands); // TODO: pra que serve cada um ?
        }
    }

    /**
     * Armazena no atributo this.modals os modais (interfaces) a serem utilizados pelos comandos.
     */
    async registerModals() {
        try {
            const { dirFiles, directory } = await this.folderFiles("modals")

            console.log({ modalFiles: dirFiles });
            dirFiles.forEach(async (filepath) => {
                const modal: ModalType = await this.importFile(
                    path.join(directory, filepath)
                );
                if (!modal) return;
                this.modals.set(modal.customId, modal);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async createWebhook({
        webhookName,
        channelName,
    }: {
        webhookName: string;
        channelName: string;
    }) {
        const guildId = env.DISCORD_GUILD_ID;
        const guild = this.guilds.cache.get(guildId);
        if (!guild) {
            throw new Error("Servidor não encontrado.");
        }
        const channels = guild.channels.cache.find(
            (c) => c.name.toLowerCase() === channelName.toLocaleLowerCase()
        ) as TextChannel;
        if (!channels) {
            throw new Error(`Nenhum canal ${channelName} encontrado.`);
        }
        const webhooks = await channels.fetchWebhooks();
        const existingWebhook = webhooks.find(
            (webhook) => webhook.name === webhookName
        );
        if (!existingWebhook) {
            const webhook = await channels.createWebhook({
                name: webhookName,
                avatar: "https://i.ibb.co/rpkBgxZ/msg-1183775647-43870.jpg",
                reason:
                    "Um Webhook para ajudar no processo de assinatura de certificados",
            });
            this.webhook = webhook;
        }
        this.webhook = existingWebhook;
    }
}
