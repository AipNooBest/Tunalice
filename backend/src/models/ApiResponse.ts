export default class ApiResponse {
    code: number
    message: string
    body: object | undefined

    constructor(message: string, code: number = 200, body?: object) {
        this.message = message
        this.code = code
        this.body = body
    }
}