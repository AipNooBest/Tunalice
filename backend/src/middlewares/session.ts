import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import c from "../consts";
import logger from "../utils/logger";
import cache from "../utils/cache";
import RequestWithJWT from "../interfaces/requestWithJWT";
import { BadRequestError } from "../exceptions/badRequestError";
import { ApiError } from "../exceptions/apiError";
import { UnauthorizedError } from "../exceptions/unauthorizedError";

export default {
    authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new BadRequestError(c.TOKEN_IS_INCORRECT)
        }
        const secret = process.env.APP_SECRET;
        if (!secret){
            logger.error("Переменная APP_SECRET не установлена на этапе аутентификации. Невозможно создать токен")
            throw new ApiError()
        }

        let jwtToken: jwt.Jwt
        try {
            jwtToken = jwt.verify(token, secret, {
                algorithms: ['HS256'],
                complete: true
            })
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                logger.info("Попытка входа с истёкшим токеном")
            } else {
                logger.warn(err, "Ошибка при верификации JWT токена")
            }
            throw new UnauthorizedError(c.TOKEN_IS_INCORRECT)
        }
        // Проверка того, что токен присутствует в чёрном списке (считается невалидным)
        if (cache.get(jwtToken.signature)) {
            throw new UnauthorizedError(c.TOKEN_IS_INCORRECT)
        }
        (req as RequestWithJWT).jwt = jwtToken
        next()
    }
}