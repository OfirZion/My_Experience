"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
// import authMiddleware from "../common/auth_middleware";
router.get('/', user_controller_1.default.get.bind(user_controller_1.default));
router.get('/:id', user_controller_1.default.getById.bind(user_controller_1.default));
router.post('/', user_controller_1.default.post.bind(user_controller_1.default));
router.put('/:id', user_controller_1.default.put.bind(user_controller_1.default));
router.delete('/:id', user_controller_1.default.delete.bind(user_controller_1.default));
exports.default = router; // ADD AUTH MIDDLEWARE, bind to userController
//# sourceMappingURL=user_route.js.map