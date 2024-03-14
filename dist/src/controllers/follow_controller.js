"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Request, Response } from 'express';
const base_controller_1 = require("./base_controller");
const follow_model_1 = __importDefault(require("../models/follow_model"));
class FollowController extends base_controller_1.BaseController {
    constructor() {
        super(follow_model_1.default);
    }
}
exports.default = new FollowController(); // override post with owner = user._id later
//# sourceMappingURL=follow_controller.js.map