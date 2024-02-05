"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userPostSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    post_owner_name: { type: String, required: true },
    post_owner_id: { type: String, required: true },
    imgUrl: { type: String, required: false },
    exp_rating: { type: Number, required: true }
});
exports.default = mongoose_1.default.model("UserPost", userPostSchema);
//# sourceMappingURL=user_post_model.js.map