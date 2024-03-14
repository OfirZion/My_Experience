"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_comment_controller_1 = __importDefault(require("../controllers/user_comment_controller"));
// import authMiddleware from "../common/auth_middleware";
router.get('/', user_comment_controller_1.default.get);
router.get('/:id', user_comment_controller_1.default.getById);
router.post('/', user_comment_controller_1.default.post);
router.put('/:id', user_comment_controller_1.default.put);
router.delete('/:id', user_comment_controller_1.default.delete);
exports.default = router; // ADD AUTH MIDDLEWARE, bind to userCommentController
//# sourceMappingURL=user_comment_route.js.map