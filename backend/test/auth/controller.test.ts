import request from "supertest";
import bodyParser from "body-parser";
import routes from "../../src/routes/v1";
import express from "express";
import dotenv from "dotenv";
import ApiResponse from "../../src/models/ApiResponse";
dotenv.config();

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(routes)

afterEach(() => {
    jest.clearAllMocks()
});
jest.mock('../../src/services/auth', () => ({
    signup: () => {
        return new Promise(resolve => resolve(new ApiResponse("Успех")))
    }
}))

describe('validation-tests', () => {
    test("not-provided-data", async () => {
        // Должен выдать ошибку в случае, если не получено одно из значений
        const res = await request(app)
            .post('/auth/signup')
            .send({
                email: "test@test.com",
                password: "12345678"
            })
        expect(res.status).toBe(400)
    })
    test("invalid-name", async () => {
        // Должен выдать ошибку в случае, если имя некорректно
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "Какой-тоLeviy234Логин",
                email: "test@test.com",
                password: "12345678"
            })
        expect(res.status).toBe(400)
    })
    test("invalid-email", async () => {
        // Должен выдать ошибку в случае, если почта некорректна
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "SomeTestUser",
                email: "invalid@email",
                password: "12345678"
            })
        expect(res.status).toBe(400)
    })
    test("short-password", async () => {
        // Должен выдать ошибку в случае, если пароль слишком короткий
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "SomeTestUser",
                email: "test@test.com",
                password: "123456"
            })
        expect(res.status).toBe(400)
    })
    test("valid-data", async () => {
        // Должен вернуть 200, если все данные корректны
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "SomeTestUser",
                email: "test@test.com",
                password: "12345678"
            })
        expect(res.status).toBe(200)
    })
})
