import theory from "../services/theory";
import {NextFunction, Request, Response} from "express";

export default {
    list(_req: Request, res: Response, next: NextFunction) {
        theory.list()
            .then(r => res.status(r.code).json(r))
            .catch(next)
    },
    getById(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id)
        theory.getById(id)
            .then(r => res.status(r.code).json(r))
            .catch(next)
    },
    categories(_req: Request, res: Response, next: NextFunction) {
        theory.categories()
            .then(r => res.status(r.code).json(r))
            .catch(next)
    }
}