import db from '../utils/postgres'
import ApiResponse from "../models/ApiResponse";

export default {
    info: async (userId: number) => {
        const userInfo = await db.query('SELECT username, email, registration_date FROM users WHERE id = $1', [userId])
        return new ApiResponse("Успешно", 200, userInfo.rows)
    }
}