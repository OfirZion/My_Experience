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
const rating_post_model_1 = __importDefault(require("../models/rating_post_model"));
const user_post_model_1 = __importDefault(require("../models/user_post_model"));
class RatingPostController extends base_controller_1.BaseController {
    constructor() {
        super(rating_post_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // rate a post
            const userAuth = req.user;
            const ratingBody = req.body;
            const postId = req.params.id;
            try {
                const newRating = yield this.model.create(Object.assign(Object.assign({}, ratingBody), { user: userAuth._id, post: postId }));
                // add the rating to the post
                yield user_post_model_1.default.findByIdAndUpdate(postId, { $push: { ratings: newRating._id } });
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
            // rate a post
            try {
                const userAuth = req.user;
                const postId = req.params.id;
                // check if the user has already rated the post
                let rated = yield this.model.findOne({ user: userAuth._id, post: postId }).populate('user');
                if (rated) {
                    if (rated.rating_type !== req.body.rating_type) {
                        rated.rating_type = req.body.rating_type;
                        rated = yield rated.save();
                        res.status(200).json({
                            data: rated,
                            message: "Rating updated - Changed",
                            status: 200
                        });
                        return;
                    }
                    const updated = yield this._delete(req, res, rated);
                    if (updated) {
                        res.status(200).json({
                            data: updated,
                            message: "Rating updated - Deleted",
                            status: 200
                        });
                        return;
                    }
                }
                else {
                    const newRating = yield this._post(req);
                    res.status(201).json({
                        data: newRating,
                        message: "Rating created",
                        status: 201
                    });
                    return;
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
    _delete(req, res, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAuth = req.user;
            const owner = rating.user._id.toString();
            if (owner !== userAuth._id) {
                res.status(401).json({
                    message: "Unauthorized",
                    status: 401
                });
                return false;
            }
            yield user_post_model_1.default.findByIdAndUpdate(rating.post, { $pull: { ratings: rating._id } });
            yield this.model.findByIdAndDelete(rating._id);
            return true;
        });
    }
    _post(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // rate a post
            const userAuth = req.user;
            const ratingBody = req.body;
            const postId = req.params.id;
            let newRating = yield this.model.create(Object.assign(Object.assign({}, ratingBody), { user: userAuth._id, post: postId }));
            newRating = yield newRating.populate('user');
            // add the rating to the post
            yield user_post_model_1.default.findByIdAndUpdate(postId, { $push: { ratings: newRating._id } });
            return newRating;
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
                yield user_post_model_1.default.findByIdAndUpdate(rating.post, { $pull: { ratings: rating._id } });
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).json({
                    message: "Rating deleted",
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
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(405).json({
                message: "Method not allowed",
                status: 405
            });
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(405).json({
                message: "Method not allowed",
                status: 405
            });
        });
    }
}
exports.default = new RatingPostController();
//# sourceMappingURL=rating_post_controller.js.map