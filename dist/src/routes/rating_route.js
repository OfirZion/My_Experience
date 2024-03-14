"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const rating_controller_1 = __importDefault(require("../controllers/rating_controller"));
// import authMiddleware from "../common/auth_middleware";
router.get('/', rating_controller_1.default.get);
router.get('/:id', rating_controller_1.default.getById);
router.post('/', rating_controller_1.default.post);
router.put('/:id', rating_controller_1.default.put);
router.delete('/:id', rating_controller_1.default.delete);
exports.default = router; // ADD AUTH MIDDLEWARE, bind to ratingController
//# sourceMappingURL=rating_route.js.map