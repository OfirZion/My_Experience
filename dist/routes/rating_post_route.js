"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const rating_post_controller_1 = __importDefault(require("../controllers/rating_post_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
/**
 * @swagger
 * tags:
 *   name: PostRating
 *   description: The Post Rating API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     RatingPost:
 *       type: object
 *       required:
 *         - postId
 *         - ratedBy
 *         - rating
 *         - comment
 *       properties:
 *         postId:
 *           type: string
 *           description: The post ID of the post being rated.
 *           example: "1234567890"
 *         ratedBy:
 *           type: string
 *           description: The user ID of the user who gave the rating.
 *           example: "0987654321"
 *         rating:
 *           type: integer
 *           format: int32
 *           description: The rating given to the post -  1 for like, -1 for dislike.
 *           example: 1
 *         comment:
 *           type: string
 *           description: The comment associated with the rating.
 *           example: "Great post!"
 */
/**
 * @swagger
 * /postRatings:
 *   get:
 *     summary: The get inherited Method is Not Allowed for this model
 *     tags: [PostRating]
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 */
/**
 * @swagger
 * /postRatings/{id}:
 *   get:
 *     summary: The getByID inherited Method is Not Allowed for this model
 *     tags: [PostRating]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post rating ID
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 */
/**
 * @swagger
 * /postRatings/{id}:
 *   post:
 *     summary: Create a new post rating for a specific post by Post Rated ID (POC, in practice it occurs via Put method)
 *     tags: [PostRating]
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
 *             $ref: '#/components/schemas/RatingPost'
 *     responses:
 *       201:
 *         description: The post rating was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatingPost'
 *       406:
 *         description: Not Acceptable
 */
/**
 * @swagger
 * /postRatings/{id}:
 *   put:
 *     summary: Create, Update or Delete a specific post rating by Post Rated ID, depending on the rating type (1 for like, -1 for dislike)
 *     tags: [PostRating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingPost'
 *     responses:
 *       200:
 *         description: The post rating was successfully updated or deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatingPost'
 *       201:
 *         description: The post rating was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatingPost'
 *       401:
 *         description: Unauthorized
 *       406:
 *         description: Not Acceptable
 */
/**
 * @swagger
 * /postRatings/{id}:
 *   delete:
 *     summary: Delete a specific post rating by Post Rated ID (POC, in practice it occurs via Put method)
 *     tags: [PostRating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post rating ID
 *     responses:
 *       200:
 *         description: The post rating was successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The post rating was not found
 *       500:
 *         description: General error
 */
router.get('/', rating_post_controller_1.default.get.bind(rating_post_controller_1.default));
router.get('/:id', rating_post_controller_1.default.getById.bind(rating_post_controller_1.default));
router.post('/:id', auth_middleware_1.default, rating_post_controller_1.default.post.bind(rating_post_controller_1.default));
router.put('/:id', auth_middleware_1.default, rating_post_controller_1.default.put.bind(rating_post_controller_1.default));
router.delete('/:id', auth_middleware_1.default, rating_post_controller_1.default.delete.bind(rating_post_controller_1.default));
exports.default = router;
//# sourceMappingURL=rating_post_route.js.map