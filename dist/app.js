"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const user_auth_route_1 = __importDefault(require("./routes/user_auth_route"));
const user_post_route_1 = __importDefault(require("./routes/user_post_route"));
const user_comment_route_1 = __importDefault(require("./routes/user_comment_route"));
const rating_user_route_1 = __importDefault(require("./routes/rating_user_route"));
const rating_post_route_1 = __importDefault(require("./routes/rating_post_route"));
const rating_comment_route_1 = __importDefault(require("./routes/rating_comment_route"));
const follow_route_1 = __importDefault(require("./routes/follow_route"));
const multer_1 = __importDefault(require("multer"));
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
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const initApp = (url = prod_DB_URL) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(url);
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use("/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
    // upload a file route
    app.post("/upload", upload.single("file"), (req, res) => {
        res.status(201).send({
            message: "File uploaded successfully",
            data: `http://${process.env.DOMAIN_BASE}:${process.env.PORT}/public/${req.file.filename}`,
            status: 201
        });
    });
    // ADD ROUTES HERE
    app.use("/users", user_route_1.default);
    app.use("/auth", user_auth_route_1.default);
    app.use("/posts", user_post_route_1.default);
    app.use("/comments", user_comment_route_1.default);
    app.use("/userRatings", rating_user_route_1.default);
    app.use("/postRatings", rating_post_route_1.default);
    app.use("/commentRatings", rating_comment_route_1.default);
    app.use("/follows", follow_route_1.default);
    return app;
});
exports.default = initApp;
//# sourceMappingURL=app.js.map