export class InvalidInputLinkError extends Error {
    constructor(inputs: string[]) {
        super(`Os seguintes inputs estão inválidos: ${inputs}`)
    }
}