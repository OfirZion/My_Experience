"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const rating_comment_controller_1 = __importDefault(require("../controllers/rating_comment_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
router.get('/', rating_comment_controller_1.default.get.bind(rating_comment_controller_1.default));
router.get('/:id', rating_comment_controller_1.default.getById.bind(rating_comment_controller_1.default));
router.post('/', auth_middleware_1.default, rating_comment_controller_1.default.post.bind(rating_comment_controller_1.default));
router.put('/:id', auth_middleware_1.default, rating_comment_controller_1.default.put.bind(rating_comment_controller_1.default));
router.delete('/:id', auth_middleware_1.default, rating_comment_controller_1.default.delete.bind(rating_comment_controller_1.default));
exports.default = router; // ADD AUTH MIDDLEWARE, bind to RatingPostController
//# sourceMappingURL=rating_comment_route.js.map