"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const follow_controller_1 = __importDefault(require("../controllers/follow_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
router.get('/', follow_controller_1.default.get.bind(follow_controller_1.default));
router.get('/:id', follow_controller_1.default.getById.bind(follow_controller_1.default));
router.post('/', auth_middleware_1.default, follow_controller_1.default.post.bind(follow_controller_1.default));
router.put('/:id', auth_middleware_1.default, follow_controller_1.default.put.bind(follow_controller_1.default));
router.delete('/:id', auth_middleware_1.default, follow_controller_1.default.delete.bind(follow_controller_1.default));
exports.default = router;
//# sourceMappingURL=follow_route.js.map