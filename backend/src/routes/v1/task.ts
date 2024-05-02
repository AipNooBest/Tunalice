import task from '../../controllers/task'
import { Router } from 'express'
import {asyncHandler} from "../../middlewares/asyncHandler";
const router = Router()

router.get('/list', asyncHandler(task.list))
router.get('/:id([0-9]+)/details', asyncHandler(task.getDetailsById))

export default router