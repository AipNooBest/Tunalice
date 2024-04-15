import auth from '../../controllers/auth';
import session from '../../middlewares/session';
import { Router } from "express";
const router = Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/logout', session.authenticate, auth.logout);

export default router;