import {NextFunction, Request, Response} from "express";
import task from '../services/task'
import helpers from "../utils/helpers";
import RequestWithJWT from "../interfaces/requestWithJWT";
import validator from "../utils/validator";
import {BadRequestError} from "../exceptions/badRequestError";

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
    },
    createInstance: (req: Request, res: Response, next: NextFunction) => {
        let taskId = parseInt(req.params.id)
        let userId = helpers.getUserIdFromRequest(req as RequestWithJWT)
        task.createInstance(taskId, userId)
            .then(r => res.status(r.code).json(r))
            .catch(next)
    },
    deleteInstance: (req: Request, res: Response, next: NextFunction) => {
        let userId = helpers.getUserIdFromRequest(req as RequestWithJWT)
        task.deleteInstance(userId)
            .then(r => res.status(r.code).json(r))
            .catch(next)
    },
    submitFlag: (req: Request, res: Response, next: NextFunction) => {
        let userId = helpers.getUserIdFromRequest(req as RequestWithJWT)
        const { flag } = req.body
        if (!validator.isAlphanumerical(flag) || flag.length > 100) {
            throw new BadRequestError()
        }

        task.submitFlag(userId, flag)
            .then(r => res.status(r.code).json(r))
            .catch(next)
    }
}