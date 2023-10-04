export class PythonVenvNotActivatedError  extends Error{
    constructor() {
        super(`Pythons Virtual environment not activated.`)
    }
}