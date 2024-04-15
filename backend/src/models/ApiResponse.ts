import { Response } from "express";

export default class ApiResponse {
    code: number
    message: string
    body: object | undefined

    constructor(code: number, message: string, body?: object) {
        this.code = code
        this.message = message
        this.body = body
    }

    send(res: Response): void {
        res.status(this.code).send(this.message)
    }
}