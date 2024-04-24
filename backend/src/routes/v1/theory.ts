import theory from "../../controllers/theory";
import { Router } from "express";
import {asyncHandler} from "../../middlewares/asyncHandler";
const router = Router();

router.get('/list', asyncHandler(theory.list));
router.get('/:id([0-9]+)', asyncHandler(theory.getById));

export default router