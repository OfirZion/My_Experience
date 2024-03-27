import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from 'path'
import userRouter from "./routes/user_route";
import userAuthRouter from "./routes/user_auth_route";
import userPostRouter from "./routes/user_post_route";
import userCommentRouter from "./routes/user_comment_route";
import ratingUserRouter from "./routes/rating_user_route";
import ratingPostRouter from "./routes/rating_post_route";
import ratingCommentRouter from "./routes/rating_comment_route";
import followRouter from "./routes/follow_route";
import multer from "multer";
const prod_DB_URL = process.env.DB_URL;
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
 *     Upload_File:
 *       type: object
 *       required:
 *         - message
 *         - data
 *         - status
 *       properties:
 *         message:
 *           type: string
 *           description: The status message of the file upload.
 *           example: "File uploaded successfully"
 *         data:
 *           type: string
 *           description: The URL of the uploaded file.
 *           example: "http://localhost:5000/public/1234567890_file.jpg"
 *         status:
 *           type: integer
 *           description: The status code of the file upload.
 *           example: 201
 */
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [File]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload
 *         required: true
 *     responses:
 *       201:
 *         description: The file was successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Upload_File'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */

// multer disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const upload = multer({ storage: storage });


const initApp = async (url = prod_DB_URL): Promise<Express> => {
    await mongoose.connect(url!)
    const app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/public", express.static(path.join(__dirname, "../public"))); 

    // upload a file route
    app.post("/upload", upload.single("file"), (req, res) => {
        res.status(201).send({
            message: "File uploaded successfully",
            data: `http://${process.env.DOMAIN_BASE}:${process.env.PORT}/public/${req.file.filename}`,
            status: 201
        });
    });
    // ADD ROUTES HERE
    app.use("/users", userRouter);
    app.use("/auth", userAuthRouter);
    app.use("/posts", userPostRouter);
    app.use("/comments", userCommentRouter);
    app.use("/userRatings", ratingUserRouter);
    app.use("/postRatings", ratingPostRouter);
    app.use("/commentRatings", ratingCommentRouter);
    app.use("/follows", followRouter);
    return app
}

export default initApp;