import db from "../utils/postgres";
import ApiResponse from "../models/ApiResponse";
import {NotFoundError} from "../exceptions/notFoundError";
import fs from "fs";
import path from "node:path";
import c from "../consts"
import logger from "../utils/logger";
import docker from "../utils/docker"
import cache from "../utils/cache";


export default {
    list: async () => {
        const allTasks = await db.query('SELECT id, name, difficulty, path FROM tasks', [])
        return new ApiResponse("Успешно", 200, allTasks.rows)
    },
    getDetailsById: async (id: number) => {
        const specificTask = await db.query('SELECT name, difficulty, path, theory_id FROM tasks WHERE id = $1', [id])
        if (specificTask.rows.length === 0) {
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }
        const { name, difficulty, path: taskPath } = specificTask.rows[0]
        // На всякий случай проверяем, что путь не содержит лишних символов во избежание Path Traversal
        const fullPath = path.resolve(`${process.cwd() + process.env.DATA_PATH}/practice/` + taskPath)
        if (!fullPath.startsWith(path.resolve(`${process.cwd() + process.env.DATA_PATH}/practice/`)) || !path.isAbsolute(fullPath)) {
            logger.warn(fullPath, "Попытка эксплуатации Path Traversal")
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }
        let fileContent: string
        try {
            fileContent = fs.readFileSync(fullPath + "/README.md", {encoding: 'utf-8'})
        } catch (e) {
            logger.warn(fullPath, "Файл README.md по указанному пути не найден")
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }
        return new ApiResponse("Успешно", 200, {name, difficulty, content: fileContent})
    },
    getSourceById: async (id: number) => {
        const specificTask = await db.query('SELECT path FROM tasks WHERE id = $1', [id])
        if (specificTask.rows.length === 0) {
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }
        const { path: taskPath } = specificTask.rows[0]
        // На всякий случай проверяем, что путь не содержит лишних символов во избежание Path Traversal
        const sourceCodePath = path.resolve(`${process.cwd() + process.env.DATA_PATH}/practice/${taskPath}/src/`)
        if (!sourceCodePath.startsWith(path.resolve(`${process.cwd() + process.env.DATA_PATH}/practice/`)) || !path.isAbsolute(sourceCodePath)) {
            logger.warn(sourceCodePath, "Попытка эксплуатации Path Traversal")
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }

        const sourceCodeDir = fs.readdirSync(sourceCodePath);
        const files: object[] = [];
        sourceCodeDir.forEach((file) => {
            const data = fs.readFileSync(sourceCodePath + "/" + file, 'utf-8');
            files.push({ filename: file, content: data });
        });
        return new ApiResponse("Успешно", 200, {files})
    },
    createInstance: async (taskId: number, userId: number) => {
        const specificTask = await db.query('SELECT path FROM tasks WHERE id = $1', [taskId])
        if (specificTask.rows.length === 0) {
            throw new NotFoundError(c.TASK_NOT_FOUND)
        }
        const { path: taskPath } = specificTask.rows[0]
        const composePath = path.resolve(`${process.cwd() + process.env.DATA_PATH}/practice/${taskPath}/docker-compose.yml`)
        if (!composePath.startsWith(path.resolve(`${process.cwd() + process.env.DATA_PATH}/practice/`)) || !path.isAbsolute(composePath)) {
            logger.warn(composePath, "Попытка эксплуатации Path Traversal")
            throw new NotFoundError(c.TASK_NOT_FOUND)
        }

        let containerId = await docker.runTask(composePath, userId)
        let flag = "testflagstring"
        cache.add(String(userId), flag)
        return new ApiResponse("Успешно", 200, {containerId})
    }
}