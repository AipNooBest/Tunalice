import express, { Express } from "express";
import db from "./utils/postgres"
import bodyParser from 'body-parser';
import routes from './routes/v1/'
import dotenv from "dotenv";
import logger from "./utils/logger";
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


const app: Express = express();
const port: string = process.env.APP_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/v1', routes)
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});