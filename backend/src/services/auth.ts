import db from '../utils/postgres'
import ApiResponse from "../models/ApiResponse";
import logger from "../utils/logger";
import argon2 from "argon2";
import jwt from "jsonwebtoken"
import c from "../consts";
import cache from "../utils/cache";

export default {
    signup: async (name: string, email: string, password: string) => {
        const existingAccounts = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, name])
        if (!existingAccounts || existingAccounts.rows.length > 0) {
            logger.debug("Попытка зарегистрироваться с существующим аккаунтом", email, name)
            return new ApiResponse(409, "Аккаунт уже существует")
        }
        logger.trace("Начинается хэширование пароля")
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2i,
            memoryCost: 4096,
            parallelism: 1
        })
        logger.trace("Хэширование успешно. Длина хэша: ", hashedPassword.length)
        await db.query(
            'INSERT INTO users (username, email, registration_date, password)' +
            ' VALUES ($1, $2, NOW()::date, $3)', [name, email, hashedPassword]
        )
        return new ApiResponse(200, "Аккаунт успешно создан")
    },
    login: async (emailOrUsername: string, password: string) => {
        const queryResult = await db.query('SELECT id, password FROM users WHERE email = $1 OR username = $1', [emailOrUsername])
        let isPasswordCorrect = false
        if (!queryResult || queryResult.rows.length === 0) {
            logger.debug(emailOrUsername, "Попытка зайти под несуществующим аккаунтом")
        } else {
            isPasswordCorrect = await argon2.verify(queryResult.rows[0].password.trim(), password)
        }
        if (!isPasswordCorrect) {
            return new ApiResponse(401, c.INCORRECT_LOGIN_OR_PASSWORD)
        }

        const secret = process.env.APP_SECRET
        if (!secret){
            logger.error("Переменная APP_SECRET не установлена на этапе аутентификации. Невозможно создать токен")
            return new ApiResponse(500, c.INTERNAL_SERVER_ERROR)
        }
        let token = jwt.sign({user_id: queryResult.rows[0].id}, secret, {
            expiresIn: '10h',
            algorithm: 'HS256'
        })
        return new ApiResponse(200, c.LOGIN_SUCCESSFUL, {token})
    },
    logout: (signature: string, expires: number) => {
        cache.addWithTimeout(signature, "", Date.now() - expires)
        return new ApiResponse(200, c.LOGOUT_SUCCESSFUL)
    }
}