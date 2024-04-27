import db from "../utils/postgres";
import ApiResponse from "../models/ApiResponse";


export default {
    list: async () => {
        const allTasks = await db.query('SELECT id, name, difficulty, path FROM tasks', [])
        return new ApiResponse("Успешно", 200, allTasks.rows)
    }
}