import request from "supertest";
import { newDb } from "pg-mem";
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import routes from "../../src/routes/v1";
import { errorHandler } from "../../src/middlewares/error";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(routes)
app.use(errorHandler)

const db = newDb()
db.public.none(fs.readFileSync('../database/001-create-tables.sql', 'utf-8'))
const backup = db.backup()

jest.mock('../../src/utils/postgres', () => ({
    query: async (text: string, params: Array<any>) => {
        let formattedQuery = formatSQLQuery(text, params)
        return db.public.query(formattedQuery)
    }
}))

jest.mock('jsonwebtoken', () => ({
    sign: (_payload: string, _secret: string, _options: object) => {
        return "token-used-for-testing-purposes"
    },
    verify: (_payload: string, _secretOrPublicKey: string, _options: object) => {
        return {
            signature: "some-signature",
            payload: {
                user_id: 1
            }
        }
    }
}))

describe("signup-tests", () => {
    test("create-new-account", async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "SomeTestUser",
                email: "test@test.com",
                password: "12345678"
            })
        const saved = db.public.one('SELECT username, email FROM users')

        expect(res.status).toBe(200)
        expect(saved.username).toBe('SomeTestUser')
        expect(saved.email).toBe('test@test.com')
    })
    test("login-to-new-account-with-name", async () => {
        process.env.APP_SECRET = "this-secret-is-used-only-for-tests!"
        const res = await request(app)
            .post('/auth/login')
            .send({
                emailOrUsername: "SomeTestUser",
                password: "12345678"
            })

        expect(res.status).toBe(200)
        expect(res.body.body.token).toBe("token-used-for-testing-purposes")
    })
    test("login-to-new-account-with-email", async () => {
        process.env.APP_SECRET = "this-secret-is-used-only-for-tests!"
        const res = await request(app)
            .post('/auth/login')
            .send({
                emailOrUsername: "test@test.com",
                password: "12345678"
            })

        expect(res.status).toBe(200)
        expect(res.body.body.token).toBe("token-used-for-testing-purposes")
    })
    test("change-password", async () => {
        process.env.APP_SECRET = "this-secret-is-used-only-for-tests!"
        const res = await request(app)
            .post('/auth/change-password')
            .set('Authorization', 'Bearer some.jwt.token')
            .send({
                oldPassword: "12345678",
                newPassword: "myNewTestEpicPassword"
            })

        expect(res.status).toBe(200)
    })
})

// --- Вспомогательные функции --- //

function formatSQLQuery(query: string, params: Array<any>) {
    let formattedQuery = query;

    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const placeholder = '$' + (i + 1);
        const escapedParam = typeof param === 'string' ? "'" + param.replace(/'/g, "''") + "'" : param;
        formattedQuery = formattedQuery.replace(new RegExp('\\' + placeholder, 'g'), escapedParam);
    }

    return formattedQuery;
}