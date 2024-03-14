import express from 'express';
const router = express.Router();
import userController from '../controllers/user_controller';
import authMiddleware from "../middleware/auth_middleware";


router.get('/me', authMiddleware, userController.me.bind(userController));
router.get('/', userController.get.bind(userController));
router.get('/:id', authMiddleware, userController.getById.bind(userController));
router.put('/:id', authMiddleware, userController.put.bind(userController));
router.delete('/:id', authMiddleware, userController.delete.bind(userController));

export default router; 