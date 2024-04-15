import { Router } from 'express'
import task from './task';
import auth from "./auth";
const router = Router()

router.get('/status', (req, res) => {
    res.json({
        message: 'OK',
        timestamp: new Date().toISOString(),
        IP: req.ip,
        URL: req.originalUrl,
    });
});

router.use('/auth', auth)
router.use('/task', task)

export default router