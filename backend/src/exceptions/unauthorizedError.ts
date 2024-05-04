import c from "../consts";
import { ApiError } from "./apiError";

export class UnauthorizedError extends ApiError {
    constructor(message: string = c.TOKEN_NOT_PROVIDED) {
        super(message, 401);
    }
}