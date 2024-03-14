import express from "express";
const router = express.Router();
import userPostController from "../controllers/user_post_controller";
import authMiddleware from "../middleware/auth_middleware";

router.get("/", userPostController.get.bind(userPostController));
router.get("/:id", userPostController.getById.bind(userPostController));
router.post("/",authMiddleware, userPostController.post.bind(userPostController));
router.put("/:id",authMiddleware, userPostController.put.bind(userPostController));
router.delete("/:id",authMiddleware, userPostController.delete.bind(userPostController));

export default router; // ADD AUTH MIDDLEWARE, bind to userPostController