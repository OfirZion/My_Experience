 import express from 'express';
const router = express.Router();
import followController from '../controllers/follow_controller';
import authMiddleware from "../middleware/auth_middleware";

router.get('/', followController.get.bind(followController));
router.get('/:id', followController.getById.bind(followController));
router.post('/',authMiddleware, followController.post.bind(followController));
router.put('/:id',authMiddleware, followController.put.bind(followController));
router.delete('/:id',authMiddleware, followController.delete.bind(followController));

export default router; 