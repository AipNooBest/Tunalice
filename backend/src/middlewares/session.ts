import {NextFunction, Request, Response} from "express";
import ApiResponse from "../models/ApiResponse";

export default {
    authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json(new ApiResponse(401, "No token provided"));
        }
    }
}