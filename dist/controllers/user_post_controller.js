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
const user_post_model_1 = __importDefault(require("../models/user_post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
class UserPostController extends base_controller_1.BaseController {
    constructor() {
        super(user_post_model_1.default);
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find().sort({}).populate([{ path: "ratings", model: "PostRating" },
                    { path: "post_owner", model: "User" },
                    { path: "comments", model: "UserComment",
                        populate: [{ path: "ratings", model: "CommentRating",
                                populate: { path: "user", model: "User" }
                            }, { path: "comment_owner", model: "User" }]
                    }
                ]);
                res.status(200).json({
                    data: response,
                    message: "Data found",
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
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postBody = req.body;
            const userAuth = req.user;
            try {
                const newPost = yield this.model.create(Object.assign(Object.assign({}, postBody), { post_owner: userAuth._id, created_at: new Date() }));
                // add to the user's post array the post's id
                yield user_model_1.default.findByIdAndUpdate(userAuth._id, {
                    $push: { posts: newPost._id }
                });
                res.status(201).json({
                    data: newPost,
                    message: "Post created",
                    status: 201
                });
            }
            catch (error) {
                res.status(406).json({
                    message: error.message,
                    status: 406
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userAuth = req.user;
                const post = yield this.model.findById(req.params.id); // .populate()
                if (post == null) {
                    res.status(404).json({
                        message: "Post not found",
                        status: 404
                    });
                    return;
                }
                // post_owner here is a objectId (no populate)
                const owner = post.post_owner.toString();
                if (owner !== userAuth._id) {
                    res.status(401).json({
                        message: "Unauthorized",
                        status: 401
                    });
                    return;
                }
                yield user_model_1.default.findByIdAndUpdate(userAuth._id, {
                    $pull: { posts: post._id }
                });
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    message: "Post deleted",
                    status: 200,
                    data: post
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
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userAuth = req.user;
                const post = yield this.model.findById(req.params.id);
                if (post == null) {
                    res.status(404).json({
                        message: "Post not found",
                        status: 404
                    });
                    return;
                }
                // post_owner here is a objectId (no populate)
                const owner = post.post_owner.toString();
                if (owner !== userAuth._id) {
                    res.status(401).json({
                        message: "Unauthorized",
                        status: 401
                    });
                    return;
                }
                const response = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.status(200).json({
                    data: response,
                    message: "Post updated",
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
}
exports.default = new UserPostController(); // override post with owner = user._id later
//# sourceMappingURL=user_post_controller.js.map