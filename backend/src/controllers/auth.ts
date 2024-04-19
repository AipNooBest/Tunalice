import auth from '../services/auth';
import { Request, Response } from "express";
import ApiResponse from "../models/ApiResponse";
import valid from "../utils/validator";
import logger from "../utils/logger";
import c from "../consts"
import RequestWithJWT from '../interfaces/requestWithJWT';
import exp from "node:constants";

export default {
    signup(req: Request, res: Response) {
        const { name, email, password } = req.body;
        if (!name || !email || !password || !name.length) {
            return res.status(400).send(new ApiResponse(400, c.MISSING_FIELDS))
        }
        if (!valid.isAlphanumerical(name) || !valid.isEmail(email)) {
            return res.status(400).send(new ApiResponse(400, c.INVALID_DATA))
        }
        if (password.length < 8) {
            return res.status(400).send(new ApiResponse(400, "Слишком короткий пароль"))
        }

        auth.signup(name, email, password)
            .then(r => {
                logger.info({code: r.code, server_message: r.message}, "Сервер успешно ответил пользователю");
                res.status(r.code).json(r)
            })
            .catch(err => {
                logger.error(err, "Произошла ошибка на стороне сервера")
                const httpErr = new ApiResponse(500, c.INTERNAL_SERVER_ERROR)
                res.status(httpErr.code).send(httpErr)
            })
    },
    login(req: Request, res: Response) {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
            return res.status(400).send(new ApiResponse(400, c.MISSING_FIELDS))
        }
        if (!valid.isAlphanumerical(emailOrUsername) && !valid.isEmail(emailOrUsername)) {
            return res.status(400).send(new ApiResponse(400, c.INVALID_DATA))
        }

        auth.login(emailOrUsername, password)
            .then(r => {
                logger.info({code: r.code, server_message: r.message}, "Сервер успешно ответил пользователю");
                res.status(r.code).json(r)
            })
            .catch(err => {
                logger.error(err, "Произошла ошибка на стороне сервера")
                const httpErr = new ApiResponse(500, c.INTERNAL_SERVER_ERROR)
                res.status(httpErr.code).send(httpErr)
            })
    },
    logout(req: Request, res: Response) {
        let jwtTokenSig: any = (req as RequestWithJWT).jwt.signature
        let expires
        try {
            let payload = (req as RequestWithJWT).jwt.payload
            expires = typeof payload === 'string' ? JSON.parse(payload).exp : payload.exp
        } catch (e) {
            logger.error(expires)
            return res.status(400).send(new ApiResponse(400, c.INVALID_DATA))
        }
        if (!jwtTokenSig) {
            // Вряд-ли это вообще возможно, но на всякий случай добавляем проверку
            return res.status(400).send(new ApiResponse(400, c.INVALID_DATA))
        }

        let result = auth.logout(jwtTokenSig, expires)
        res.send(result.code).json(result)
    }
}