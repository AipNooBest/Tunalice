import theory from "../services/theory";
import {Request, Response} from "express";

export default {
    list(_req: Request, res: Response) {
        theory.list()
            .then(r => res.status(r.code).json(r))
    }
}