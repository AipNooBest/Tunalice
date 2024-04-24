import { Request, Response } from "express";
import task from '../services/task'

export default {
    list: (req: Request, res: Response) => {
        let err: boolean = req.query.error?.toString() === 'true';
        task.list(err)
            .then(tasks => res.json(tasks))
    }
}