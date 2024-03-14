import express from 'express';
const router = express.Router();
import RatingCommentController from '../controllers/rating_comment_controller';
import authMiddleware from "../middleware/auth_middleware";

router.get('/', RatingCommentController.get.bind(RatingCommentController));
router.get('/:id', RatingCommentController.getById.bind(RatingCommentController));
router.post('/', authMiddleware, RatingCommentController.post.bind(RatingCommentController));
router.put('/:id', authMiddleware, RatingCommentController.put.bind(RatingCommentController));
router.delete('/:id', authMiddleware, RatingCommentController.delete.bind(RatingCommentController));


export default router; // ADD AUTH MIDDLEWARE, bind to RatingPostController