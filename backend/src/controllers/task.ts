import {NextFunction, Request, Response} from "express";
import task from '../services/task'

export default {
    list: (_req: Request, res: Response, next: NextFunction) => {
        task.list()
            .then(r => res.status(r.code).json(r))
            .catch(next)
    },
    getDetailsById: (req: Request, res: Response, next: NextFunction) => {
        let id = parseInt(req.params.id)
        task.getDetailsById(id)
            .then(r => res.status(r.code).json(r))
            .catch(next)
    },
    getSourceById: (req: Request, res: Response, next: NextFunction) => {
        let id = parseInt(req.params.id)
        res.header("Access-Control-Allow-Origin", "*");
        task.getSourceById(id)
            .then(r => res.status(r.code).json(r))
            .catch(next)
    }
}