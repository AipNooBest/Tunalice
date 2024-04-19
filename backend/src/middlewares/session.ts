import {NextFunction, Request, Response} from "express";
import ApiResponse from "../models/ApiResponse";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import c from "../consts"
import logger from "../utils/logger";
import cache from "../utils/cache";
import RequestWithJWT from "../interfaces/requestWithJWT";

export default {
    authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json(new ApiResponse(401, c.TOKEN_NOT_PROVIDED));
        }
        const secret = process.env.APP_SECRET;
        if (!secret){
            logger.error("Переменная APP_SECRET не установлена на этапе аутентификации. Невозможно создать токен")
            return res.status(500).json(new ApiResponse(500, c.INTERNAL_SERVER_ERROR))
        }

        try {
            let jwtToken = jwt.verify(token, secret, {
                algorithms: ['HS256'],
                complete: true
            })
            if (cache.get(jwtToken.signature)) {
                return res.status(401).json(new ApiResponse(401, c.TOKEN_IS_INCORRECT))
            }
            (req as RequestWithJWT).jwt = jwtToken
            next()
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                logger.info("Попытка входа с истёкшим токеном")
            } else {
                logger.warn(err, "Ошибка при верификации JWT токена")
            }
            return res.status(401).json(new ApiResponse(401, c.TOKEN_IS_INCORRECT))
        }
    }
}