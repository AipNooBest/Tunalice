import { Request, Response } from "express";
import task from '../services/task'
import ApiResponse from "../models/ApiResponse";

export default {
    list: (req: Request, res: Response) => {
        let err: boolean = req.query.error?.toString() === 'true';
        task.list(err)
            .then(tasks => res.json(tasks))
            .catch(err => {
                if (err instanceof ApiResponse) {
                    res.status(err.code).json(err)
                } else {
                    res.status(500)
                }
            });
    }
}