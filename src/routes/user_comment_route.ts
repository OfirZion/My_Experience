import express from 'express';
const router = express.Router();
import userCommentController from '../controllers/user_comment_controller';
import authMiddleware from "../middleware/auth_middleware"; 

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: The Comment API
 */ 
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - message
 *         - post
 *         - ratings
 *         - comment_owner_name
 *         - comment_owner
 *       properties:
 *         message:
 *           type: string
 *           description: The message of the comment.
 *           example: "This is a sample comment."
 *         post:
 *           type: string
 *           description: The ID of the post the comment is associated with.
 *           example: "60d6ec9f1093b2c524c482bd"
 *         ratings:
 *           type: array
 *           items:
 *             type: string
 *           description: The IDs of the ratings associated with the comment.
 *           example: ["60d6ec9f1093b2c524c482bd", "60d6ec9f1093b2c524c482be"]
 *         comment_owner_name:
 *           type: string
 *           description: The name of the comment owner.
 *           example: "John Doe"
 *         comment_owner:
 *           type: string
 *           description: The ID of the user who owns the comment.
 *           example: "60d6ec9f1093b2c524c482bd"
 */
/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comments by Post ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: The comment was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /comments/one_comment/{id}:
 *   get:
 *     summary: Get a specific comment by ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: The comment was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /comments/{id}:
 *   post:
 *     summary: Create a new comment for a specific post by ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       406:
 *         description: Not acceptable
 *       401:
 *         description: Unauthorized
 */ 
/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a specific comment by ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The comment was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The comment was not found
 *       500:
 *         description: General error
 */
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a specific comment by ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: The comment was successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The comment was not found
 *       500:
 *         description: General error
 */

router.get('/:id', userCommentController.get.bind(userCommentController));
router.get('/one_comment/:id', userCommentController.getById.bind(userCommentController));
router.post('/:id',authMiddleware, userCommentController.post.bind(userCommentController));
router.put('/:id',authMiddleware, userCommentController.put.bind(userCommentController));
router.delete('/:id',authMiddleware, userCommentController.delete.bind(userCommentController));

export default router; 