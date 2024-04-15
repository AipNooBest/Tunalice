import pg, {DatabaseError} from 'pg';
import logger from './logger';

const pool = new pg.Pool()

export default {
    query: async (text: string, params: Array<any>) => {
        try {
            const start = Date.now()
            const res = await pool.query(text, params)
            const duration = Date.now() - start
            logger.info({text, duration, rows: res.rowCount}, "Выполнен SQL-запрос")
            return res
        } catch (e) {
            if (e instanceof DatabaseError) {
                logger.error({details: {
                        query: text,
                        params: params,
                        code: e.code,
                        message: e.detail,
                        table: e.table,
                        routine: e.routine
                    }}, "SQL-запрос привёл к ошибке")
            } else {
                logger.fatal("Произошла ошибка при выполнении запроса не со стороны БД")
            }
            throw e
        }
    }
}