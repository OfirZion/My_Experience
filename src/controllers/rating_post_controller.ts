// import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import PostRating,{IPostRating}  from '../models/rating_post_model';
import {Request,Response} from 'express';

import Post from '../models/user_post_model';
import { ObjectId } from 'mongoose';
import { IUser } from '../models/user_model';
class RatingPostController extends BaseController<IPostRating> {
    constructor(){
        super(PostRating);
    }


    async post(req: Request, res: Response) {
        // rate a post
        const userAuth = req.user
        const ratingBody = req.body;
        const postId = req.params.id;
        
        try {
            const newRating = await this.model.create({
                ...ratingBody,
                user: userAuth._id,
                post: postId
            });


            // add the rating to the post
            await Post.findByIdAndUpdate(postId, { $push: { ratings: newRating._id } });
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

    async put (req: Request, res: Response) {
        // rate a post
        try {
            const userAuth = req.user
            const postId = req.params.id;
            // check if the user has already rated the post
            let rated = await this.model.findOne({ user: userAuth._id, post: postId }).populate('user');
            if(rated) {
                if(rated.rating_type !== req.body.rating_type){  
                    rated.rating_type = req.body.rating_type;
                    rated = await rated.save();
                    res.status(200).json({
                        data: rated,
                        message: "Rating updated - Changed",
                        status: 200
                    });
                    return
                }
                const updated = await this._delete(req, res, rated)
                if(updated) {
                    res.status(200).json({
                        data: updated,
                        message: "Rating updated - Deleted",
                        status: 200
                    });
                    return
                }
            } else {
                const newRating = await this._post(req);
                res.status(201).json({
                    data: newRating,
                    message: "Rating created",
                    status: 201
                });
                return
            }
        } catch (error) {
            res.status(406).json({
                message: error.message,
                status: 406
            });
        }
 }

    private async _delete(req: Request, res: Response, rating: IPostRating)  {
        const userAuth = req.user;
        const owner = (rating.user as IUser)._id.toString()
        if (owner !== userAuth._id) {
            res.status(401).json({
                message: "Unauthorized",
                status: 401
            });
            return false
        }

        await Post.findByIdAndUpdate(rating.post, { $pull: { ratings: rating._id } })
        await this.model.findByIdAndDelete(rating._id);
        return true
    }
   
    private async _post(req: Request)  {
        // rate a post
        const userAuth = req.user
        const ratingBody = req.body;
        const postId = req.params.id;
        let newRating = await this.model.create({
            ...ratingBody,
            user: userAuth._id,
            post: postId
        });
        newRating = await newRating.populate('user');
        // add the rating to the post
         await Post.findByIdAndUpdate(postId, { $push: { ratings: newRating._id } });
         return newRating;
    }

    async delete(req:Request, res: Response) {
        try {
            const userAuth = req.user;
            const rating = await this.model.findById(req.params.id)
            if (rating == null) {
                res.status(404).json({
                    message: "Rating not found",
                    status: 404
                });
                return 
            }

            const owner = (rating.user as ObjectId).toString()
            if (owner !== userAuth._id) {
                res.status(401).json({
                    message: "Unauthorized",
                    status: 401
                });
                return
            }

            await Post.findByIdAndUpdate(rating.post, { $pull: { ratings: rating._id } })
            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: "Rating deleted",
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
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
} 

export default new RatingPostController(); 