import Docker from "dockerode"
import Compose from "dockerode-compose"
import logger from "./logger";
import path from "node:path";

let docker = new Docker()

export default {
    runTask: async (taskPath: string, userId: number): Promise<string> => {
        await cleanOldContainers(userId)
        let taskName = path.basename(path.dirname(taskPath))
        if (!taskName) {
            logger.error(taskPath, "Невозможно запустить задание. Неправильно указан путь")
            throw new Error("Неправильно указан путь до задания")
        }
        let compose: Compose
        try {
            compose = new Compose(docker, taskPath, `user-${userId}_${taskName}`)
        } catch (e) {
            throw new Error("Неправильно указан путь до задания или в задании не существует файла docker-compose.yml")
        }
        let failCounter = 0
        while (true) {
            try {
                let task = await compose.up()
                return task.services[0].id
            } catch (e) {
                if (!(e instanceof Error)){
                    logger.error(e, "Произошла неизвестная ошибка при запуске задания")
                    throw e
                }
                // Здесь приходится использовать startsWith вместо получения объекта
                if (e.message.startsWith("(HTTP code 409) unexpected - Conflict")) {
                    if (failCounter === 3) throw e
                    await cleanOldContainers(userId)
                } else {
                    logger.error(e, "Произошла ошибка при запуске задания")
                    throw e
                }
            }
            failCounter++
        }
    }
}

async function cleanOldContainers(userId: number) {
    let containerList = await docker.listContainers({all: true})
    for (let item of containerList) {
        if (item.Names.some((name) => name.startsWith(`/user-${userId}`))) {
            let container = docker.getContainer(item.Id)
            try {
                await container.stop({t: 10})
            } catch (e) {
                logger.debug(e, "Ошибка при остановке контейнера")
            } finally {
                await container.remove()
            }
        }
    }
}