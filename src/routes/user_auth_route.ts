import express from "express";
const router = express.Router();
import authController from "../controllers/user_auth_controller";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

 /**
 * @swagger
 * components:
 *   schemas:
 *     AuthData:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email.
 *         password:
 *           type: string
 *           description: The user's password.
 *       example:
 *         email: "test@gmail.com"
 *         password: "123456Aa!"
 *     UserData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *         age:
 *           type: integer
 *           description: The user's age.
 *         imgUrl:
 *           type: string
 *           description: The user's image URL.
 *         my_rating:
 *           type: integer
 *           description: The user's rating.
 *         followers:
 *           type: array
 *           items: 
 *             type: string
 *           description: The users that this user is following.
 *         following:
 *           type: array
 *           items: 
 *             type: string
 *           description: The users that are following this user.
 *       example:
 *         name: "test"
 *         age: 20
 *         imgUrl: ""
 *         my_rating: 0
 *         followers: []
 *         following: []
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user's ID.
 *         authData:
 *           $ref: '#/components/schemas/AuthData'
 *         userData:
 *           $ref: '#/components/schemas/UserData'
 *       example:
 *         _id: undefined
 *         authData:
 *           email: "test@gmail.com"
 *           password: "123456Aa!"
 *         userData:
 *           name: "test"
 *           age: 20
 *           imgUrl: ""
 *           my_rating: 0
 *           followers: []
 *           following: []
 */

/**
* @swagger
* components:
*   schemas:
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       example:
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/User'
 *       400:
 *         description: error - missing email or password or general error
 *       406:
 *         description: error - Email already exists
 */ 

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthData'
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: email or password incorrect
 *       400:
 *         description: missing email or password or general error
 */ 

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user was successfully logged out
 *       401:
 *         description: invalid/missing refresh token or general error
 */ 

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh the authentication token
 *     tags: [Auth]
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authentication token was successfully refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Invalid/missing refresh token or general error
 */
 
router.post("/register", authController.register.bind(authController));
router.post("/google/callback",authController.googleSignin.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.get("/refresh", authController.refresh.bind(authController));

export default router;
