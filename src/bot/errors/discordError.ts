export class DiscordError extends Error {
    constructor(resource: string) {
        super(`${resource}`)
    }
}