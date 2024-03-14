import express from 'express';
const router = express.Router();
import RatingPostController from '../controllers/rating_post_controller';
import authMiddleware from "../middleware/auth_middleware";

router.get('/', RatingPostController.get.bind(RatingPostController));
router.get('/:id', RatingPostController.getById.bind(RatingPostController));
router.post('/', authMiddleware, RatingPostController.post.bind(RatingPostController));
router.put('/:id',authMiddleware, RatingPostController.put.bind(RatingPostController));
router.delete('/:id',authMiddleware, RatingPostController.delete.bind(RatingPostController));

export default router; 