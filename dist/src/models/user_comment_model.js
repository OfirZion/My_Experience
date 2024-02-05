"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userCommentSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    comment_owner_name: { type: String, required: true },
    comment_owner_id: { type: String, required: true },
    comment_father_id: { type: String, required: true }
});
exports.default = mongoose_1.default.model("UserComment", userCommentSchema);
//# sourceMappingURL=user_comment_model.js.map