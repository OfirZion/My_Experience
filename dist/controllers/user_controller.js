"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base_controller");
const user_model_1 = __importDefault(require("../models/user_model"));
class UserController extends base_controller_1.BaseController {
    constructor() {
        super(user_model_1.default);
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query.name) {
                    const response = yield this.model.find({ name: req.query.name }).populate({
                        path: "auth",
                        select: ["-password", "-refreshTokens"]
                    });
                    res.status(200).json({
                        data: response,
                        message: "Data found - get",
                        status: 200
                    });
                }
                else {
                    const response = yield this.model.find().populate({
                        path: "auth",
                        select: ["-password", "-refreshTokens"]
                    });
                    res.status(200).json({
                        data: response,
                        message: "Data found - get",
                        status: 200
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    message: error.message,
                    status: 500
                });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(req.params.id).populate([
                    {
                        path: "auth",
                        select: ["-password", "-refreshTokens"]
                    },
                    {
                        path: "followers",
                        populate: {
                            path: "follower",
                        }
                    },
                    {
                        path: "following",
                        populate: {
                            path: "following",
                        }
                    },
                    {
                        path: "posts",
                        populate: {
                            path: "ratings",
                            model: "PostRating"
                        }
                    },
                    { path: "ratings", model: "UserRating" }
                ]);
                res.status(200).json({
                    data: response,
                    message: "Data found - getById",
                    status: 200
                });
            }
            catch (error) {
                res.status(500).json({
                    message: error.message,
                    status: 500
                });
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(req.user._id).populate([
                    { path: "auth", model: "UserAuth" },
                    { path: "followers", populate: { path: "follower", model: "User" } },
                    { path: "following", populate: { path: "following", model: "User" } },
                    { path: "ratings", model: "UserRating" }
                ]);
                res.status(200).json({
                    data: response,
                    message: "Data found - me",
                    status: 200
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    message: error.message,
                    status: 500
                });
            }
        });
    }
}
exports.default = new UserController(); // override post with _id later
//# sourceMappingURL=user_controller.js.map