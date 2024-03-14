"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Request, Response } from 'express';
const base_controller_1 = require("./base_controller");
const rating_model_1 = __importDefault(require("../models/rating_model"));
class RatingController extends base_controller_1.BaseController {
    constructor() {
        super(rating_model_1.default);
    }
}
exports.default = new RatingController(); // override post with owner = user._id later
//# sourceMappingURL=rating_controller.js.map