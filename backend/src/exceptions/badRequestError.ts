import c from '../consts'
import { ApiError } from './apiError';

export class BadRequestError extends ApiError {
    constructor(message: string = c.INVALID_DATA) {
        super(message, 400);
    }
}