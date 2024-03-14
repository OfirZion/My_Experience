"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_comment_controller_1 = __importDefault(require("../controllers/user_comment_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
router.get('/:id', user_comment_controller_1.default.get.bind(user_comment_controller_1.default));
router.get('/one_comment/:id', user_comment_controller_1.default.getById.bind(user_comment_controller_1.default));
router.post('/:id', auth_middleware_1.default, user_comment_controller_1.default.post.bind(user_comment_controller_1.default));
router.put('/:id', auth_middleware_1.default, user_comment_controller_1.default.put.bind(user_comment_controller_1.default));
router.delete('/:id', auth_middleware_1.default, user_comment_controller_1.default.delete.bind(user_comment_controller_1.default));
exports.default = router; // ADD AUTH MIDDLEWARE, bind to userCommentController
//# sourceMappingURL=user_comment_route.js.map