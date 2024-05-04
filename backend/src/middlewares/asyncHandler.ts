import { NextFunction, Request, Response } from "express";

/**
 * Асинхронный обработчик для обертывания API эндпоинтов, позволяющий асинхронно обрабатывать ошибки.
 * @param fn Функция для вызова конечной точки API.
 * @returns Promise с оператором catch
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};