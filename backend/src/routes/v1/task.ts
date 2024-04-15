import task from '../../controllers/task'
import { Router } from 'express'
const router = Router()

router.get('/list', task.list)

export default router