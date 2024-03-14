"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); //Schema,
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    auth: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "UserAuth" }, // INITIALIZE LATER AFTER IMPLEMENTING USER_AUTH
    imgUrl: { type: String, required: false },
    ratings: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "UserRating", required: false }], // {array of ratings}
    posts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "UserPost", required: false }], // {array of following}
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Follow", required: false }], // {array of following}
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Follow", required: false }] // {array of followers}
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user_model.js.map