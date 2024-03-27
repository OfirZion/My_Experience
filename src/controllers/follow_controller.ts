 // import { Request, Response } from 'express';
import { BaseController } from './base_controller'; 
import Follow,{IFollow}  from '../models/follow_model';
import {
    Request,
    Response
} from 'express';
import User from '../models/user_model';
import { ObjectId } from 'mongoose';

class FollowController extends BaseController<IFollow> {
    constructor() {
        super(Follow);
    }

    async post(req: Request, res: Response) {
        res.status(405).json({
            message: "Method not allowed",
            status: 405
        });
    }
    async delete(req: Request, res: Response) {
        res.status(405).json({
            message: "Method not allowed",
            status: 405
        });
    }
    async getById(req: Request, res: Response) {
        res.status(405).send({
            message: "Method not allowed",
            status: 405
        });
    }
    async get(req: Request, res: Response) {
        res.status(405).send({
            message: "Method not allowed",
            status: 405
        });
    }

    async put(
        req: Request,
        res: Response
    ) {
        const userAuth = req.user
        try {

            const currentUser = await User.findById(userAuth._id).populate("following");
            const following = (currentUser.following as IFollow[])?.map(follow => (follow.following as ObjectId).toString());
            if(following.includes(req.params.id)) {  // if already following
                
                let follow = await this.model.findOne({
                    follower: userAuth._id,
                    following: req.params.id
                });
                follow = await follow.populate('following')

                await User.findByIdAndUpdate(req.params.id, { $pull: { followers: follow._id } });
                await User.findByIdAndUpdate(userAuth._id, { $pull: { following:  follow._id } });
                await follow.deleteOne()
                res.status(200).json({
                    message: "Unfollowed",
                    status: 200,
                    data: follow
                }); // return the deleted follow
            } else {
                
                let newFollow = await this.model.create({
                    follower: userAuth._id,
                    following: req.params.id,
                    dateAdded: new Date()
                });

                newFollow = await newFollow.populate('following');
                await User.findByIdAndUpdate(req.params.id, { $push: { followers: newFollow._id } });
                await User.findByIdAndUpdate(userAuth._id, { $push: { following:  newFollow._id } });
                res.status(200).json({
                    message: "Followed",
                    status: 200,
                    data: newFollow
                });
            }

        } catch (error) {
            res.status(406).json({
                message: error.message,
                status: 406
            });
        }
    }
} 

export default new FollowController(); // override post with owner = user._id later