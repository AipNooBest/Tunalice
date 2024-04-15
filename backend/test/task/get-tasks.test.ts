import request from "supertest";
import routes from '../../src/routes/v1'
import express from "express";

const app = express()
app.use(routes)

afterEach(() => {
    jest.clearAllMocks();
});

describe('get-tasks', () => {
    test("get-all-tasks", async () => {
        const res = await request(app).get('/task/list')
        expect(res.status).toBe(200)
    })
})
