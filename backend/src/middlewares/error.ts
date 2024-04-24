import { Request, Response, NextFunction } from 'express';
import { ApiError, IResponseError } from '../exceptions/apiError';
import logger from "../utils/logger";
import c from "../consts";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    if (!(err instanceof ApiError)) {
        logger.error(err, "Произошла ошибка на стороне сервера")
        res.status(500).send(
            JSON.stringify({
                message: c.INTERNAL_SERVER_ERROR
            })
        );
    } else {
        const customError = err as ApiError;
        let response = {
            message: customError.message
        } as IResponseError;
        if (customError.additionalInfo) response.additionalInfo = customError.additionalInfo;
        res.status(customError.status).type('json').send(JSON.stringify(response));
    }
}