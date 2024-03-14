"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Request, Response } from 'express';
const base_controller_1 = require("./base_controller");
const user_comment_model_1 = __importDefault(require("../models/user_comment_model"));
class UserCommentController extends base_controller_1.BaseController {
    constructor() {
        super(user_comment_model_1.default);
    }
}
exports.default = new UserCommentController(); // override post with owner = user._id later
//# sourceMappingURL=user_comment_controller.js.map