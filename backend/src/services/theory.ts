import db from '../utils/postgres'
import ApiResponse from "../models/ApiResponse";
import {NotFoundError} from "../exceptions/notFoundError";
import logger from "../utils/logger";
import c from "../consts";
import path from "node:path";
import fs from "fs";

export default {
    list: async () => {
        const allTheory = await db.query('SELECT id, theme, path FROM theories', [])
        return new ApiResponse("Успешно", 200, allTheory.rows)
    },
    getById: async (id: number) => {
        const specificTheory = await db.query('SELECT theme, path FROM theories WHERE id = $1', [id])
        if (specificTheory.rows.length === 0) {
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }
        const { theme, path: taskPath } = specificTheory.rows[0]
        // На всякий случай проверяем, что путь не содержит лишних символов во избежание Path Traversal
        const fullPath = path.resolve(`${process.cwd() + process.env.DATA_PATH}/theory/` + taskPath)
        if (!fullPath.startsWith(path.resolve(`${process.cwd() + process.env.DATA_PATH}/theory/`)) || !path.isAbsolute(fullPath)) {
            logger.warn(fullPath, "Попытка эксплуатации Path Traversal")
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }

        let fileContent: string
        try {
            fileContent = fs.readFileSync(fullPath, {encoding: 'utf-8'})
        } catch (e) {
            logger.warn(fullPath, "Файл теории по указанному пути не найден")
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }

        return new ApiResponse("Успешно", 200, {theme, content: fileContent})
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