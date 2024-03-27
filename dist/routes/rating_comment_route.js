"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const rating_comment_controller_1 = __importDefault(require("../controllers/rating_comment_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
/**
 * @swagger
 * tags:
 *   name: CommentRating
 *   description: The Comment Rating API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     RatingComment:
 *       type: object
 *       required:
 *         - commentId
 *         - ratedBy
 *         - rating
 *         - commentText
 *       properties:
 *         commentId:
 *           type: string
 *           description: The comment ID of the comment being rated.
 *           example: "1234567890"
 *         ratedBy:
 *           type: string
 *           description: The user ID of the user who gave the rating.
 *           example: "0987654321"
 *         rating:
 *           type: integer
 *           format: int32
 *           description: The rating given to the comment -  1 for like, -1 for dislike.
 *           example: 1
 *         commentText:
 *           type: string
 *           description: The text of the comment associated with the rating.
 *           example: "Great comment!"
 */
/**
 * @swagger
 * /commentRatings:
 *   get:
 *     summary: The get inherited Method is Not Allowed for this model
 *     tags: [CommentRating]
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 */
/**
 * @swagger
 * /commentRatings/{id}:
 *   get:
 *     summary: The get By ID inherited Method is Not Allowed for this model
 *     tags: [CommentRating]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment rating ID
 *     responses:
 *       500:
 *         description: This inherited Method is Not Allowed for this model
 */
/**
 * @swagger
 * /commentRatings/{id}:
 *   put:
 *     summary: The put ID inherited Method is Not Allowed for this model
 *     tags: [CommentRating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingComment'
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /commentRatings/{id}:
 *   post:
 *     summary: Create a new comment rating for a specific comment by Comment ID
 *     tags: [CommentRating]
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
 *             $ref: '#/components/schemas/RatingComment'
 *     responses:
 *       201:
 *         description: The comment rating was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatingComment'
 *       406:
 *         description: Not Acceptable
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /commentRatings/{id}:
 *   delete:
 *     summary: Delete a specific comment rating by ID
 *     tags: [CommentRating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment rating ID
 *     responses:
 *       200:
 *         description: The comment rating was successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The comment rating was not found
 *       500:
 *         description: General error
 */
router.get('/', rating_comment_controller_1.default.get.bind(rating_comment_controller_1.default));
router.get('/:id', rating_comment_controller_1.default.getById.bind(rating_comment_controller_1.default));
router.post('/:id', auth_middleware_1.default, rating_comment_controller_1.default.post.bind(rating_comment_controller_1.default));
router.put('/:id', auth_middleware_1.default, rating_comment_controller_1.default.put.bind(rating_comment_controller_1.default));
router.delete('/:id', auth_middleware_1.default, rating_comment_controller_1.default.delete.bind(rating_comment_controller_1.default));
exports.default = router;
//# sourceMappingURL=rating_comment_route.js.map