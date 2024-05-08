import db from "../utils/postgres";
import ApiResponse from "../models/ApiResponse";
import { NotFoundError } from "../exceptions/notFoundError";
import { ApiError } from "../exceptions/apiError";
import fs from "fs/promises"
import path from "node:path";
import c from "../consts";
import logger from "../utils/logger";
import docker from "../utils/docker";
import cache from "../utils/cache";


export default {
    list: async () => {
        const allTasks = await db.query('SELECT id, name, difficulty, path FROM tasks', [])
        return new ApiResponse(c.SUCCESS, 200, allTasks.rows)
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
            fileContent = await fs.readFile(fullPath + "/README.md", {encoding: 'utf-8'})
        } catch (e) {
            logger.warn(fullPath, "Файл README.md по указанному пути не найден")
            throw new NotFoundError(c.THEORY_NOT_FOUND)
        }
        return new ApiResponse(c.SUCCESS, 200, {name, difficulty, content: fileContent})
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

        let tree = await prepareFileTree(sourceCodePath)

        return new ApiResponse(c.SUCCESS, 200, {tree})
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
        cache.add(String(userId), flag + "|" + taskId)
        return new ApiResponse(c.SUCCESS, 200, {containerId})
    },
    deleteInstance: async (userId: number) => {
        await docker.deleteTask(userId)
        cache.remove(String(userId))
        return new ApiResponse(c.SUCCESS)
    },
    submitFlag: async (userId: number, userFlag: string) => {
        let taskFlagAndId = cache.get(String(userId))
        if (!taskFlagAndId) {
            throw new NotFoundError(c.FLAG_NOT_FOUND)
        }

        let taskFlag = taskFlagAndId.split('|')[0]
        let taskId = taskFlagAndId.split('|')[1]

        if (taskFlag !== userFlag) {
            throw new ApiError(c.FLAG_IS_INCORRECT, 409)
        }
        const checkScoreQuery = await db.query('SELECT task_id, user_id FROM solved WHERE task_id = $1 AND user_id = $2', [taskId, userId])
        if (checkScoreQuery.rows.length !== 0) {
            return new ApiResponse(c.TASK_ALREADY_SOLVED_BUT_FLAG_IS_CORRECT, 202)
        }

        await db.query('INSERT INTO solved (task_id, user_id) VALUES ($1, $2)', [taskId, userId])

        return new ApiResponse(c.FLAG_IS_CORRECT)
    }
}


async function prepareFileTree(sourceCodePath: string): Promise<object> {
    let files = new Map()

    const getFilesRecursively = async (directory: string): Promise<string[]> => {
        const filesInDirectory = await fs.readdir(directory)
        let returnedFiles = []
        for (const fileName of filesInDirectory) {
            const absolute = path.join(directory, fileName)
            const fileId = absolute.replace(sourceCodePath + path.sep, "").replaceAll(path.sep, "_")
            if ((await fs.stat(absolute)).isDirectory()) {
                files.set(fileId, {
                    text: fileName,
                    custom: {
                        isFile: false
                    },
                    children: await getFilesRecursively(absolute)
                })
            } else {
                let content = await fs.readFile(absolute, {encoding: 'utf-8'})
                files.set(fileId, {
                    text: fileName,
                    custom: {
                        isFile: true,
                        content
                    }
                })
            }
            returnedFiles.push(fileId)
        }
        return returnedFiles
    };

    await getFilesRecursively(sourceCodePath)
    return Object.fromEntries(files)
}