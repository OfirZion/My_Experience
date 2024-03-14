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
const rating_comment_model_1 = __importDefault(require("../models/rating_comment_model"));
const user_comment_model_1 = __importDefault(require("../models/user_comment_model"));
class RatingCommentController extends base_controller_1.BaseController {
    constructor() {
        super(rating_comment_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // rate a comment
            const userAuth = req.user;
            const ratingBody = req.body;
            const commentId = req.params.id;
            try {
                const newRating = yield this.model.create(Object.assign(Object.assign({}, ratingBody), { user: userAuth._id, comment: commentId }));
                // add the rating to the comment
                yield user_comment_model_1.default.findByIdAndUpdate(commentId, { $push: { ratings: newRating._id } });
                res.status(201).json({
                    data: newRating,
                    message: "Rating created",
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
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(405).json({
                message: "Method not allowed",
                status: 405
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userAuth = req.user;
                const rating = yield this.model.findById(req.params.id);
                if (rating == null) {
                    res.status(404).json({
                        message: "Rating not found",
                        status: 404
                    });
                    return;
                }
                const owner = rating.user.toString();
                if (owner !== userAuth._id) {
                    res.status(401).json({
                        message: "Unauthorized",
                        status: 401
                    });
                    return;
                }
                yield user_comment_model_1.default.findByIdAndUpdate(rating.comment, { $pull: { ratings: rating._id } });
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    message: "Rating deleted",
                    status: 200,
                    data: rating
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
exports.default = new RatingCommentController(); // override post with owner = user._id later
//# sourceMappingURL=rating_comment_controller.js.map