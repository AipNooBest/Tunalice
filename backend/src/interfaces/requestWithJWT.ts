import { Request } from 'express';
import {Jwt} from "jsonwebtoken";

interface RequestWithJWT extends Request {
    jwt: Jwt;
}

export default RequestWithJWT;