import task from '../../controllers/task'
import { Router } from 'express'
import {asyncHandler} from "../../middlewares/asyncHandler";
import session from "../../middlewares/session";
const router = Router()

router.get('/list', asyncHandler(task.list))
router.get('/:id([0-9]+)/details', asyncHandler(task.getDetailsById))
router.get('/:id([0-9]+)/source', session.authenticate, asyncHandler(task.getSourceById))

export default router