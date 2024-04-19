let redis: Map<string, string> = new Map<string, string>()

export default {
    // Псевдо Redis. На самом деле пока здесь обычный объект
    // Потом уже будет реальный Redis
    add: (key: string, value: string) => {
        redis.set(key, value);
    },
    // Аналогия https://redis.io/docs/latest/commands/expire/
    addWithTimeout: (key: string, value: string, timeout: number) => {
        redis.set(key, value);
        setTimeout(() => redis.delete(key), timeout * 1000)
    },
    get: (key: string) => {
        return redis.get(key);
    },
    remove: (key: string) => {
        redis.delete(key);
    }
}