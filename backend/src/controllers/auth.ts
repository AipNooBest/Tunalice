import auth from '../services/auth';
import { Request, Response } from "express";
import ApiResponse from "../models/ApiResponse";
import valid from "../utils/validator";
import logger from "../utils/logger";

export default {
    signup(req: Request, res: Response) {
        const { name, email, password } = req.body;
        if (!name || !email || !password || !name.length) {
            return res.status(400).send(new ApiResponse(400, "Не указаны все необходимые поля"))
        }
        if (!valid.isAlphanumerical(name) || !valid.isEmail(email)) {
            return res.status(400).send(new ApiResponse(400, "Некорректный формат данных"))
        }
        if (password.length < 8) {
            return res.status(400).send(new ApiResponse(400, "Слишком короткий пароль"))
        }

        auth.signup(name, email, password)
            .then(r => {
                logger.info(r.code, "Сервер успешно ответил пользователю", r.message);
                res.status(r.code).json(r)
            })
            .catch(err => {
                logger.error(err, "Произошла ошибка на стороне сервера")
                const httpErr = new ApiResponse(500, "Не удалось выполнить запрос")
                res.status(httpErr.code).send(httpErr)
            })
    },
    login(req: Request, res: Response) {},
    logout(req: Request, res: Response) {}
}