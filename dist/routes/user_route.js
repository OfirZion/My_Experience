"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
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
router.get('/me', auth_middleware_1.default, user_controller_1.default.me.bind(user_controller_1.default));
router.get('/', user_controller_1.default.get.bind(user_controller_1.default));
router.get('/:id', auth_middleware_1.default, user_controller_1.default.getById.bind(user_controller_1.default));
router.put('/', auth_middleware_1.default, user_controller_1.default.put.bind(user_controller_1.default));
router.delete('/:id', auth_middleware_1.default, user_controller_1.default.delete.bind(user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_route.js.map