export class NotCreatedError  extends Error{
    constructor(resource: string) {
        super(`${resource} not created.`)
    }
}