import express from 'express';
const router = express.Router();
import RatingUserController from '../controllers/rating_user_controller';
import authMiddleware from "../middleware/auth_middleware";

router.get('/', RatingUserController.get.bind(RatingUserController));
router.get('/:id', RatingUserController.getById.bind(RatingUserController));
router.post('/:id',authMiddleware, RatingUserController.post.bind(RatingUserController));
router.put('/:id',authMiddleware, RatingUserController.put.bind(RatingUserController));
router.delete('/:id',authMiddleware, RatingUserController.delete.bind(RatingUserController));

export default router; // ADD AUTH MIDDLEWARE, bind to ratingUserController