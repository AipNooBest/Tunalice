export default {
    isAlphanumerical(str: string): boolean {
        return /^[A-Za-z0-9]+$/.test(str);
    },
    isEmail(str: string): boolean {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(str);
    }
}