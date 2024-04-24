import auth from '../../controllers/auth';
import session from '../../middlewares/session';
import { Router } from "express";
import {asyncHandler} from "../../middlewares/asyncHandler";
const router = Router();

router.post('/signup', asyncHandler(auth.signup));
router.post('/login', asyncHandler(auth.login));
router.get('/logout', session.authenticate, asyncHandler(auth.logout));

export default router;