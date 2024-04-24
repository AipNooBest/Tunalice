import auth from '../services/auth';
import {NextFunction, Request, Response} from "express";
import valid from "../utils/validator";
import logger from "../utils/logger";
import c from "../consts"
import RequestWithJWT from '../interfaces/requestWithJWT';
import {BadRequestError} from "../exceptions/badRequestError";

export default {
    signup(req: Request, res: Response, next: NextFunction) {
        const { name, email, password } = req.body;
        if (!name || !email || !password || !name.length) {
            throw new BadRequestError(c.MISSING_FIELDS)
        }
        if (!valid.isAlphanumerical(name) || !valid.isEmail(email)) {
            throw new BadRequestError(c.INVALID_DATA)
        }
        if (password.length < 8) {
            throw new BadRequestError(c.PASSWORD_TOO_SHORT)
        }

        auth.signup(name, email, password)
            .then(r => {
                logger.info({code: r.code, server_message: r.message}, "Сервер успешно ответил пользователю");
                res.status(r.code).json(r)
            })
            .catch(next)
    },
    login(req: Request, res: Response, next: NextFunction) {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
            throw new BadRequestError(c.MISSING_FIELDS)
        }
        if (!valid.isAlphanumerical(emailOrUsername) && !valid.isEmail(emailOrUsername)) {
            throw new BadRequestError(c.INVALID_DATA)
        }

        auth.login(emailOrUsername, password)
            .then(r => {
                logger.info({code: r.code, server_message: r.message}, "Сервер успешно ответил пользователю");
                res.status(r.code).json(r)
            })
            .catch(next)
    },
    logout(req: Request, res: Response) {
        let jwtTokenSig: any = (req as RequestWithJWT).jwt.signature
        let expires
        try {
            let payload = (req as RequestWithJWT).jwt.payload
            expires = typeof payload === 'string' ? JSON.parse(payload).exp : payload.exp
        } catch (e) {
            logger.error(expires)
            throw new BadRequestError(c.INVALID_DATA)
        }
        if (!jwtTokenSig) {
            // Вряд-ли это вообще возможно, но на всякий случай добавляем проверку
            throw new BadRequestError(c.INVALID_DATA)
        }

        let result = auth.logout(jwtTokenSig, expires)
        res.send(result.code).json(result)
    },
    changePassword(req: Request, res: Response, next: NextFunction) {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            throw new BadRequestError(c.MISSING_FIELDS)
        }

        if (newPassword === oldPassword) {
            throw new BadRequestError(c.SAME_PASSWORD)
        }

        if (newPassword.length < 8) {
            throw new BadRequestError(c.PASSWORD_TOO_SHORT)
        }

        let payload = (req as RequestWithJWT).jwt.payload
        let userId = typeof payload === 'string' ? JSON.parse(payload).user_id : payload.user_id

        auth.changePassword(oldPassword, newPassword, userId)
            .then(r => {
                logger.info({code: r.code, server_message: r.message}, "Сервер успешно ответил пользователю");
                res.status(r.code).json(r)
            })
            .catch(next)
    }
}