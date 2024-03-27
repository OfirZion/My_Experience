// import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import UserRating,{IUserRating}  from '../models/rating_user_model';

import { Request, Response } from 'express';
import User from '../models/user_model';
import { ObjectId } from 'mongoose';
class RatingUserController extends BaseController<IUserRating> {
    constructor() {
        super(UserRating);
    }

    async post(req: Request, res: Response) {
        const ratingBody = req.body;
        const userAuth = req.user;
        const userId = req.params.id;
        try {


            // check if we already have a rating from the user
            let rated = await this.model.findOne({ rating_user: userAuth._id, rated_user: userId });
            if(rated) {
                if(rated.rating_type !== req.body.rating_type){  
                    rated.rating_type = req.body.rating_type;
                    rated.rating = req.body.rating_type.toString();
                    rated = await rated.save();
                    res.status(200).json({
                        data: rated,
                        message: "Rating updated",
                        status: 200
                    });
                    return
                }
                res.status(200).json({
                    data: rated,
                    message: "Rating already exists",
                    status: 200
                });
                return
            }

            let newRating = await this.model.create({
                rating_user: userAuth._id,
                rated_user: userId,
                rating: ratingBody.rating_type.toString(),
                rating_type: ratingBody.rating_type
            });
            newRating = await newRating.populate('rated_user');

            await User.findByIdAndUpdate(userId, { $push: { ratings: newRating._id } });
            res.status(201).json({
                data: newRating,
                message: "Rating created",
                status: 201
            });
        } catch (error) {
            res.status(406).json({
                message: error.message,
                status: 406
            });
        }
    }


    async put(req: Request, res: Response) {
        res.status(405).json({
            message: "Method not allowed",
            status: 405
        });
    } 
   
    async get(req: Request, res: Response) {
        res.status(405).json({
            message: "Method not allowed",
            status: 405
        });
    } 

    async getById(req: Request, res: Response) {
        res.status(405).json({
            message: "Method not allowed",
            status: 405
        });
    }

    async delete(req: Request, res: Response) {
        try {
            const userAuth = req.user;
            const rating = await this.model.findById(req.params.id).populate('rated_user');
            if (rating == null) {
                res.status(404).json({
                    message: "Rating not found",
                    status: 404
                });
                return
            }

            const owner = (rating.rating_user as ObjectId).toString()
            if (owner !== userAuth._id) {
                res.status(401).json({
                    message: "Unauthorized",
                    status: 401
                });
                return
            }

            await User.findByIdAndUpdate(rating.rated_user, { $pull: { ratings: rating._id } })
            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send({
                message: "Rating deleted",
                status: 200,
                data: rating
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }

} 

export default new RatingUserController(); // override post with owner = user._id later