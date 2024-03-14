"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_post_controller_1 = __importDefault(require("../controllers/user_post_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
router.get("/", user_post_controller_1.default.get.bind(user_post_controller_1.default));
router.get("/:id", user_post_controller_1.default.getById.bind(user_post_controller_1.default));
router.post("/", auth_middleware_1.default, user_post_controller_1.default.post.bind(user_post_controller_1.default));
router.put("/:id", auth_middleware_1.default, user_post_controller_1.default.put.bind(user_post_controller_1.default));
router.delete("/:id", auth_middleware_1.default, user_post_controller_1.default.delete.bind(user_post_controller_1.default));
exports.default = router; // ADD AUTH MIDDLEWARE, bind to userPostController
//# sourceMappingURL=user_post_route.js.map