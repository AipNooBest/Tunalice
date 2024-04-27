import RequestWithJWT from "../interfaces/requestWithJWT";

export default {
    getUserIdFromRequest: (req: RequestWithJWT) => {
        let payload = (req as RequestWithJWT).jwt.payload
        return typeof payload === 'string' ? JSON.parse(payload).user_id : payload.user_id
    }
}