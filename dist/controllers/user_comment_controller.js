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
const user_comment_model_1 = __importDefault(require("../models/user_comment_model"));
const user_post_model_1 = __importDefault(require("../models/user_post_model"));
class UserCommentController extends base_controller_1.BaseController {
    constructor() {
        super(user_comment_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentBody = req.body;
            const userAuth = req.user;
            const postId = req.params.id;
            try {
                let newComment = yield this.model.create(Object.assign(Object.assign({}, commentBody), { comment_owner: userAuth._id, post: postId }));
                newComment = yield newComment.populate(['comment_owner', 'ratings']);
                // add the comment into the post
                yield user_post_model_1.default.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
                res.status(201).json({
                    data: newComment,
                    message: "Comment created",
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
                const comment = yield this.model.findById(req.params.id).populate(['comment_owner', 'post', 'ratings']);
                if (comment == null) {
                    res.status(404).json({
                        message: "Comment not found",
                        status: 404
                    });
                    return;
                }
                const owner = comment.comment_owner.toString();
                const post = comment.post;
                if (owner !== userAuth._id && userAuth._id != post.post_owner.toString()) {
                    res.status(401).json({
                        message: "Unauthorized",
                        status: 401
                    });
                    return;
                }
                // remove the comment from the post
                yield user_post_model_1.default.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
                // remove the comment
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    message: "Comment deleted",
                    status: 200,
                    data: comment
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
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.model.find({ post: req.params.id });
                res.status(200).json({
                    data: comments,
                    message: "Data found - get",
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
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userAuth = req.user;
                const comment = yield this.model.findById(req.params.id);
                if (comment == null) {
                    res.status(404).json({
                        message: "Comment not found",
                        status: 404
                    });
                    return;
                }
                const owner = comment.comment_owner.toString();
                if (owner !== userAuth._id) {
                    res.status(401).json({
                        message: "Unauthorized",
                        status: 401
                    });
                    return;
                }
                const updatedComment = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.status(200).json({
                    data: updatedComment,
                    message: "Comment updated",
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
exports.default = new UserCommentController(); // override post with owner = user._id later
//# sourceMappingURL=user_comment_controller.js.map