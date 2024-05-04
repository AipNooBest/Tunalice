export default class ApiResponse {
    code: number
    message: string
    body: object | undefined

    constructor(message: string, code: number = 200, body?: object) {
        this.code = code
        this.message = message
        this.body = body
    }
}