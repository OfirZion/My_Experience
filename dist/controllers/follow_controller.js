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
// import { Request, Response } from 'express';
const base_controller_1 = require("./base_controller");
const follow_model_1 = __importDefault(require("../models/follow_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
class FollowController extends base_controller_1.BaseController {
    constructor() {
        super(follow_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(405).json({
                message: "Method not allowed",
                status: 405
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(405).json({
                message: "Method not allowed",
                status: 405
            });
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(405).send({
                message: "Method not allowed",
                status: 405
            });
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(405).send({
                message: "Method not allowed",
                status: 405
            });
        });
    }
    put(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userAuth = req.user;
            try {
                const currentUser = yield user_model_1.default.findById(userAuth._id).populate("following");
                const following = (_a = currentUser.following) === null || _a === void 0 ? void 0 : _a.map(follow => follow.following.toString());
                if (following.includes(req.params.id)) { // if already following
                    let follow = yield this.model.findOne({
                        follower: userAuth._id,
                        following: req.params.id
                    });
                    follow = yield follow.populate('following');
                    console.log(follow._id);
                    yield user_model_1.default.findByIdAndUpdate(req.params.id, { $pull: { followers: follow._id } });
                    yield user_model_1.default.findByIdAndUpdate(userAuth._id, { $pull: { following: follow._id } });
                    yield follow.deleteOne();
                    res.status(200).json({
                        message: "Unfollowed",
                        status: 200,
                        data: follow
                    }); // return the deleted follow
                }
                else {
                    let newFollow = yield this.model.create({
                        follower: userAuth._id,
                        following: req.params.id,
                        dateAdded: new Date()
                    });
                    newFollow = yield newFollow.populate('following');
                    yield user_model_1.default.findByIdAndUpdate(req.params.id, { $push: { followers: newFollow._id } });
                    yield user_model_1.default.findByIdAndUpdate(userAuth._id, { $push: { following: newFollow._id } });
                    res.status(200).json({
                        message: "Followed",
                        status: 200,
                        data: newFollow
                    });
                }
            }
            catch (error) {
                res.status(406).json({
                    message: error.message,
                    status: 406
                });
            }
        });
    }
}
exports.default = new FollowController(); // override post with owner = user._id later
//# sourceMappingURL=follow_controller.js.map