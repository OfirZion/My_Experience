import express from 'express';
const router = express.Router();
import userController from '../controllers/user_controller';
import authMiddleware from "../middleware/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User API
 */


 /**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the current user's information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's information was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The list of users was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: General error
 */
/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update the current user's information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user's information was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a specific user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user was successfully deleted
 *       500:
 *         description: General error
 */

router.get('/me', authMiddleware, userController.me.bind(userController));
router.get('/', userController.get.bind(userController));
router.get('/:id', authMiddleware, userController.getById.bind(userController));
router.put('/', authMiddleware, userController.put.bind(userController));
router.delete('/:id', authMiddleware, userController.delete.bind(userController));

export default router; 