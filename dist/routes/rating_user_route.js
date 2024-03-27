"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const rating_user_controller_1 = __importDefault(require("../controllers/rating_user_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
/**
 * @swagger
 * tags:
 *   name: UserRating
 *   description: The User Rating API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     RatingUser:
 *       type: object
 *       required:
 *         - userId
 *         - ratedBy
 *         - rating
 *         - comment
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID of the user being rated.
 *           example: "1234567890"
 *         ratedBy:
 *           type: string
 *           description: The user ID of the user who gave the rating.
 *           example: "0987654321"
 *         rating:
 *           type: integer
 *           format: int32
 *           description: The rating given to the user.
 *           example: 4
 *         comment:
 *           type: string
 *           description: The comment associated with the rating.
 *           example: "Great user!"
 */
/**
 * @swagger
 * /userRatings:
 *   get:
 *     summary: The get inherited Method is Not Allowed for this model
 *     tags: [UserRating]
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 */
/**
 * @swagger
 * /userRatings/{id}:
 *   get:
 *     summary: The get By ID inherited Method is Not Allowed for this model
 *     tags: [UserRating]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user rating ID
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 */
/**
 * @swagger
 * /userRatings/{id}:
 *   put:
 *     summary: The Put inherited Method is Not Allowed for this model
 *     tags: [UserRating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingUser'
 *     responses:
 *       405:
 *         description: This inherited Method is Not Allowed for this model
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /userRatings/{id}:
 *   post:
 *     summary: Create or Update a user rating for a specific user by User Rated ID
 *     tags: [UserRating]
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
 *             $ref: '#/components/schemas/RatingUser'
 *     responses:
 *       201:
 *         description: The user rating was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatingUser'
 *       200:
 *         description: Rating updated/Rating already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatingUser'
 *       401:
 *         description: Unauthorized
 *       406:
 *         description: Not Acceptable
 */
/**
 * @swagger
 * /userRatings/{id}:
 *   delete:
 *     summary: Delete a specific user rating by ID
 *     tags: [UserRating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user rating ID
 *     responses:
 *       200:
 *         description: The user rating was successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The user rating was not found
 *       500:
 *         description: General error
 */
router.get('/', rating_user_controller_1.default.get.bind(rating_user_controller_1.default));
router.get('/:id', rating_user_controller_1.default.getById.bind(rating_user_controller_1.default));
router.post('/:id', auth_middleware_1.default, rating_user_controller_1.default.post.bind(rating_user_controller_1.default));
router.put('/:id', auth_middleware_1.default, rating_user_controller_1.default.put.bind(rating_user_controller_1.default));
router.delete('/:id', auth_middleware_1.default, rating_user_controller_1.default.delete.bind(rating_user_controller_1.default));
exports.default = router;
//# sourceMappingURL=rating_user_route.js.map