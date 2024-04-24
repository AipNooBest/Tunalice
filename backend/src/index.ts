import express, { Express } from "express";
import db from "./utils/postgres"
import bodyParser from 'body-parser';
import crypto from "crypto";
import routes from './routes/v1/'
import dotenv from "dotenv";
import logger from "./utils/logger";
import { errorHandler } from "./middlewares/error";
dotenv.config();

if (
    process.env.APP_PORT === undefined ||
    isNaN(parseInt(process.env.APP_PORT))
) {
    logger.fatal("Некорректная конфигурация сервера")
    process.exit(1);
}
db.query("SELECT now()", [])
    .catch(err => {
        if (err.code === 'ECONNREFUSED') {
            logger.fatal("Не удалось подключиться к базе данных. Проверьте правильность данных в конфиге")
        }
        process.exit(1);
    });

if (process.env.APP_SECRET === undefined){
    logger.warn("Переменная окружения APP_SECRET не была установлена!" +
        "Для генерации секретов будет использоваться случайное значение, которое сбросится при перезапуске!")
    process.env.APP_SECRET = crypto.randomBytes(64).toString('hex');
}


const app: Express = express();
const port: string = process.env.APP_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/v1', routes)
app.use(errorHandler)
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});