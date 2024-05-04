import db from '../utils/postgres'
import ApiResponse from "../models/ApiResponse";
import c from "../consts"

export default {
    info: async (userId: number) => {
        const userInfo = await db.query('SELECT username, email, registration_date FROM users WHERE id = $1', [userId])
        return new ApiResponse(c.SUCCESS, 200, userInfo.rows)
    }
}