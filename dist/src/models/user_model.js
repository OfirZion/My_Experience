"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); //Schema,
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    //_id: {type: Schema.Types.ObjectId},  INITIALIZE LATER AFTER IMPLEMENTING USER_AUTH
    imgUrl: { type: String, required: false },
    my_rating: { type: Number, required: true },
    follower_count: { type: Number, required: false },
    following_count: { type: Number, required: false }
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user_model.js.map