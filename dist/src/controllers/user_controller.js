"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { Request,Response } from "express";
const base_controller_1 = require("./base_controller");
const user_model_1 = __importDefault(require("../models/user_model"));
class UserController extends base_controller_1.BaseController {
    constructor() {
        super(user_model_1.default);
    }
}
exports.default = new UserController(); // override post with _id later
//# sourceMappingURL=user_controller.js.map