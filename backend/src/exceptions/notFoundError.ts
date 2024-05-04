import c from "../consts";
import { ApiError } from "./apiError";

export class NotFoundError extends ApiError {
    constructor(message: string = c.NOT_FOUND) {
        super(message, 404);
    }
}