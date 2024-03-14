"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_post_controller_1 = __importDefault(require("../controllers/user_post_controller"));
// import authMiddleware from "../common/auth_middleware";
router.get("/", user_post_controller_1.default.get);
router.get("/:id", user_post_controller_1.default.getById);
router.post("/", user_post_controller_1.default.post);
router.put("/:id", user_post_controller_1.default.put);
router.delete("/:id", user_post_controller_1.default.delete);
exports.default = router; // ADD AUTH MIDDLEWARE, bind to userPostController
//# sourceMappingURL=user_post_route.js.map