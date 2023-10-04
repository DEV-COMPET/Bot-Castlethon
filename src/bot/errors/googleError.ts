export class GoogleError extends Error {
    constructor(resource: string) {
        super(`${resource}`)
    }
}