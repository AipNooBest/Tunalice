import request from "supertest";
import {newDb} from "pg-mem";
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import routes from "../../src/routes/v1";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(routes)

const db = newDb()
db.public.none(fs.readFileSync('../database/001-create-tables.sql', 'utf-8'))
const backup = db.backup()

jest.mock('../../src/utils/postgres', () => ({
    query: async (text: string, params: Array<any>) => {
        let formattedQuery = formatSQLQuery(text, params)
        return db.public.query(formattedQuery)
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
        const result = db.public.one('SELECT username, email FROM users')

        expect(res.status).toBe(200)
        expect(result.username).toBe('SomeTestUser')
        expect(result.email).toBe('test@test.com')
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