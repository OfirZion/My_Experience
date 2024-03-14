"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const follow_controller_1 = __importDefault(require("../controllers/follow_controller"));
// import authMiddleware from "../common/auth_middleware";
router.get('/', follow_controller_1.default.get);
router.get('/:id', follow_controller_1.default.getById);
router.post('/', follow_controller_1.default.post);
router.put('/:id', follow_controller_1.default.put);
router.delete('/:id', follow_controller_1.default.delete);
exports.default = router; // ADD AUTH MIDDLEWARE, bind to followController
//# sourceMappingURL=follow_route.js.map