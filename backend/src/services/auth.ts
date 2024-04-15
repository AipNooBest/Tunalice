import db from '../utils/postgres'
import ApiResponse from "../models/ApiResponse";
import logger from "../utils/logger";
import argon2 from "argon2";

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
    login: async (email: string, password: string) => {
        new Promise((resolve, reject) => {
            resolve(true)
        })
    }
}