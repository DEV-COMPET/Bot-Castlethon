interface FetchReponseErrorInputs {
    code: number, 
    status: number, 
    message: string
}

export class FetchReponseError extends Error {
    code: number
    status: number
    message: string
    
    constructor({code, message, status} : FetchReponseErrorInputs) {
        super()
        this.code = code
        this.status = status
        this.message = message
    }
}