import db from '../utils/postgres'
import ApiResponse from "../models/ApiResponse";
import {NotFoundError} from "../exceptions/notFoundError";

export default {
    list: async () => {
        const allTheory = await db.query('SELECT id, theme, path FROM theories', [])
        return new ApiResponse("Успешно", 200, allTheory.rows)
    },
    getById: async (id: number) => {
        const specificTheory = await db.query('SELECT theme, path FROM theories WHERE id = $1', [id])
        if (specificTheory.rows.length === 0) {
            throw new NotFoundError("Теория с данным ID не найдена")
        }
        return new ApiResponse("Успешно", 200, specificTheory.rows)
    },
    categories: async () => {
        const allCategories = await db.query('SELECT DISTINCT theme FROM theories', [])
        let allCategoriesAsList: string[] = []
        for (const category of allCategories.rows) {
            allCategoriesAsList.push(category.theme)
        }

        return new ApiResponse("Успешно", 200, allCategoriesAsList)
    }
}