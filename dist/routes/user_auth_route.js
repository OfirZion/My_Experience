"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_auth_controller_1 = __importDefault(require("../controllers/user_auth_controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
router.post('/register', user_auth_controller_1.default.register.bind(user_auth_controller_1.default));
router.post('/login', user_auth_controller_1.default.login.bind(user_auth_controller_1.default));
router.post('/logout', auth_middleware_1.default, user_auth_controller_1.default.logout.bind(user_auth_controller_1.default));
router.get('/refresh', user_auth_controller_1.default.refresh.bind(user_auth_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_auth_route.js.map