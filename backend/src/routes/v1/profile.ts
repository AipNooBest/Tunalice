import profile from '../../controllers/profile'
import { Router } from 'express'
import {asyncHandler} from "../../middlewares/asyncHandler";
import session from "../../middlewares/session";
const router = Router()

router.get('/list', session.authenticate, asyncHandler(profile.list))

export default router