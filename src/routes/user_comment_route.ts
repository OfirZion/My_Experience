import express from 'express';
const router = express.Router();
import userCommentController from '../controllers/user_comment_controller';
import authMiddleware from "../middleware/auth_middleware";

router.get('/:id', userCommentController.get.bind(userCommentController));
router.get('/one_comment/:id', userCommentController.getById.bind(userCommentController));
router.post('/:id',authMiddleware, userCommentController.post.bind(userCommentController));
router.put('/:id',authMiddleware, userCommentController.put.bind(userCommentController));
router.delete('/:id',authMiddleware, userCommentController.delete.bind(userCommentController));

export default router; // ADD AUTH MIDDLEWARE, bind to userCommentController