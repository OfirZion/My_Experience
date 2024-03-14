import express from 'express';
const router = express.Router();
import authController from '../controllers/user_auth_controller';
import authMiddleware from "../middleware/auth_middleware";

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout',authMiddleware, authController.logout.bind(authController));
router.get('/refresh', authController.refresh.bind(authController));

export default router; 