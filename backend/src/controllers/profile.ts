import profile from '../services/profile'
import {NextFunction, Request, Response} from "express";
import RequestWithJWT from "../interfaces/requestWithJWT";

export default {
    list: (req: Request, res: Response, next: NextFunction) => {
        let payload = (req as RequestWithJWT).jwt.payload
        let userId = typeof payload === 'string' ? JSON.parse(payload).user_id : payload.user_id
        profile.info(userId)
            .then(r => res.status(r.code).json(r))
            .catch(next)
    }
}