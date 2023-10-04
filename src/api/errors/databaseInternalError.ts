export class DatabaseInternalError  extends Error{
    constructor(resource: string) {
        super(`Database internal error: ${resource}`)
    }
}