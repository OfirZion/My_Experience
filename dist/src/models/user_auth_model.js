"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userAuthSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    password: { type: Number, required: true },
    refreshTokens: { type: [String], required: false }
});
exports.default = mongoose_1.default.model("UserAuth", userAuthSchema);
//# sourceMappingURL=user_auth_model.js.map