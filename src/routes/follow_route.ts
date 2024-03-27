 import express from 'express';
const router = express.Router();
import followController from '../controllers/follow_controller';
import authMiddleware from "../middleware/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: The Follow API
 */ 
/**
 * @swagger
 * components:
 *   schemas:
 *     Follow:
 *       type: object
 *       required:
 *         - followId
 *         - followerId
 *         - followedId
 *       properties:
 *         followId:
 *           type: string
 *           description: The follow ID.
 *           example: "1234567890"
 *         followerId:
 *           type: string
 *           description: The user ID of the follower.
 *           example: "0987654321"
 *         followedId:
 *           type: string
 *           description: The user ID of the followed user.
 *           example: "1122334455"
 */ 
/**
 * @swagger
 * /follows:
 *   get:
 *     summary: The get inherited Method is Not Allowed for this model
 *     tags: [Follow]
 *     responses:
 *       500:
 *         description: This get inherited Method is Not Allowed for this model
 */ 
/**
 * @swagger
 * /follows/{id}:
 *   get:
 *     summary: The get By ID inherited Method is Not Allowed for this model
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The follow ID
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 */ 
/**
 * @swagger
 * /follows/{id}:
 *   post:
 *     summary: The Post inherited Method is Not Allowed for this model
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Follow'
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /follows/{id}:
 *   delete:
 *     summary: The Delete inherited Method is Not Allowed for this model
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The follow ID
 *     responses:
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 */ 
/**
 * @swagger
 * /follows/{id}:
 *   put:
 *     summary: Follow(Create) and Unfollow(Delete) a user by Followed ID, depending on if the user is already following the user or not
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The follow ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Follow'
 *     responses:
 *       200:
 *         description: The follow/Unfollow was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Follow'
 *       406:
 *         description: Not Acceptable
 *       401:
 *         description: Unauthorized
 */

router.get('/', followController.get.bind(followController));
router.get('/:id', followController.getById.bind(followController));
router.post('/',authMiddleware, followController.post.bind(followController));
router.put('/:id',authMiddleware, followController.put.bind(followController));
router.delete('/:id',authMiddleware, followController.delete.bind(followController));

export default router; 