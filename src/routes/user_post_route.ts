import express from "express";
const router = express.Router();
import userPostController from "../controllers/user_post_controller";
import authMiddleware from "../middleware/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The Post API
 */ 

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - post_owner
 *         - post_content
 *         - post_imgUrl
 *         - post_rating
 *         - post_comments
 *       properties:
 *         post_owner:
 *           type: string
 *           description: The user ID of the post owner.
 *           example: "1234567890"
 *         post_content:
 *           type: string
 *           description: The content of the post.
 *           example: "This is a sample post content."
 *         post_imgUrl:
 *           type: string
 *           description: The image URL of the post.
 *           example: "https://example.com/image.jpg"
 *         post_rating:
 *           type: integer
 *           description: The rating of the post.
 *           example: 5
 *         post_comments:
 *           type: array
 *           items:
 *             type: string
 *           description: The comments on the post.
 *           example: ["Great post!", "Thanks for sharing."]
 */
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get a list of all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: The list of posts was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a specific post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: The post was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The post was not found
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /posts/owner/{post_owner}:
 *   get:
 *     summary: Get all posts by a specific owner
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_owner
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID of the post owner
 *     responses:
 *       200:
 *         description: The posts were successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       406:
 *         description: Not Acceptable
 */ 
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a specific post by ID
 *     tags: [Post]
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
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The post was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The post was not found
 *       500:
 *         description: General error
 */ 
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a specific post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: The post was successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The post was not found
 *       500:
 *         description: General error
 */

router.get("/", userPostController.get.bind(userPostController));
router.get("/:id", userPostController.getById.bind(userPostController));
router.get("/owner/:post_owner",authMiddleware, userPostController.getByOwner.bind(userPostController));
router.post("/",authMiddleware, userPostController.post.bind(userPostController));
router.put("/:id",authMiddleware, userPostController.put.bind(userPostController));
router.delete("/:id",authMiddleware, userPostController.delete.bind(userPostController));

export default router; 