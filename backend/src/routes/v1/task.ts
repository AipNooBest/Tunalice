import task from '../../controllers/task'
import { Router } from 'express'
import {asyncHandler} from "../../middlewares/asyncHandler";
const router = Router()

router.get('/list', asyncHandler(task.list))

export default router