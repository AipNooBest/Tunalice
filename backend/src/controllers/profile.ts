import profile from '../services/profile'
import {NextFunction, Request, Response} from "express";
import RequestWithJWT from "../interfaces/requestWithJWT";
import helpers from "../utils/helpers";

export default {
    list: (req: Request, res: Response, next: NextFunction) => {
        let userId = helpers.getUserIdFromRequest(req as RequestWithJWT)
        profile.info(userId)
            .then(r => res.status(r.code).json(r))
            .catch(next)
    }
}