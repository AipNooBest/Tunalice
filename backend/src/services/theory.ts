import db from '../utils/postgres'
import ApiResponse from "../models/ApiResponse";

export default {
    list: async () => {
        const allTheory = await db.query('SELECT id, theme, path FROM theories', [])
        return new ApiResponse("Успешно", 200, allTheory.rows)
    }
}