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
const rating_user_model_1 = __importDefault(require("../models/rating_user_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
class RatingUserController extends base_controller_1.BaseController {
    constructor() {
        super(rating_user_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ratingBody = req.body;
            const userAuth = req.user;
            const userId = req.params.id;
            try {
                // check if we already have a rating from the user
                let rated = yield this.model.findOne({ rating_user: userAuth._id, rated_user: userId });
                if (rated) {
                    if (rated.rating_type !== req.body.rating_type) {
                        rated.rating_type = req.body.rating_type;
                        rated.rating = req.body.rating_type.toString();
                        rated = yield rated.save();
                        res.status(200).json({
                            data: rated,
                            message: "Rating updated",
                            status: 200
                        });
                        return;
                    }
                    res.status(200).json({
                        data: rated,
                        message: "Rating already exists",
                        status: 200
                    });
                    return;
                }
                let newRating = yield this.model.create({
                    rating_user: userAuth._id,
                    rated_user: userId,
                    rating: ratingBody.rating_type.toString(),
                    rating_type: ratingBody.rating_type
                });
                newRating = yield newRating.populate('rated_user');
                yield user_model_1.default.findByIdAndUpdate(userId, { $push: { ratings: newRating._id } });
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
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userAuth = req.user;
                const rating = yield this.model.findById(req.params.id).populate('rated_user');
                if (rating == null) {
                    res.status(404).json({
                        message: "Rating not found",
                        status: 404
                    });
                    return;
                }
                const owner = rating.rating_user.toString();
                if (owner !== userAuth._id) {
                    res.status(401).json({
                        message: "Unauthorized",
                        status: 401
                    });
                    return;
                }
                yield user_model_1.default.findByIdAndUpdate(rating.rated_user, { $pull: { ratings: rating._id } });
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).send({
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
exports.default = new RatingUserController(); // override post with owner = user._id later
//# sourceMappingURL=rating_user_controller.js.map