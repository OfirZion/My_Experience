// import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import UserPost, { IUserPost } from '../models/user_post_model'; 
import { Request,Response } from 'express';
import User from '../models/user_model';
import { ObjectId } from 'mongoose';
class UserPostController extends BaseController<IUserPost>{
    constructor() {
        super(UserPost);
    }


    async get(req: Request, res: Response) {
        try {
            const response = await this.model.find().sort({}).populate(
                [{path: "ratings", model: "PostRating"},
                {path: "post_owner", model: "User"},
                 {path: "comments", model: "UserComment", 
                    populate: [{ path: "ratings", model: "CommentRating" ,
                                populate: { path: "user", model: "User" }
                              }, {path: "comment_owner", model: "User"}]
                }
            ]);
            res.status(200).json({
                data: response,
                message: "Data found",
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }

    async post(
        req: Request, 
        res: Response
    ) {
        const postBody = req.body;
        const userAuth = req.user
        try {

            const newPost = await this.model.create({
                ...postBody,
                post_owner: userAuth._id,
                created_at: new Date()
            });
            // add to the user's post array the post's id
            await User.findByIdAndUpdate(userAuth._id, {
                $push: { posts: newPost._id }
            });
     
            res.status(201).json({
                data: newPost,
                message: "Post created",
                status: 201
            });
        } catch (error) {
            res.status(406).json({
                message: error.message,
                status: 406
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userAuth = req.user;
            const post = await this.model.findById(req.params.id); // .populate()
            if (post == null) {
                 res.status(404).json({
                        message: "Post not found",
                        status: 404
                 });
                 return
            }
            // post_owner here is a objectId (no populate)
            const owner = (post.post_owner as ObjectId).toString()
            if (owner !== userAuth._id) {
                 res.status(401).json({
                    message: "Unauthorized",
                    status: 401
                 });
                 return
            }
            
            await User.findByIdAndUpdate(userAuth._id, {
                $pull: { posts: post._id }
            });
             
            await this.model.findByIdAndDelete(req.params.id);
             res.status(200).json({
                message: "Post deleted",
                status: 200,
                data: post
             });
        } catch (error) {
             res.status(500).json({
                message: error.message,
                status: 500
             });
        }
    }


    async put(req: Request, res: Response) {
        try {
            const userAuth = req.user;
            const post = await this.model.findById(req.params.id);
            if (post == null) {
                 res.status(404).json({
                    message: "Post not found",
                    status: 404
                 });
                 return
            }
            // post_owner here is a objectId (no populate)
            const owner = (post.post_owner as ObjectId).toString()
            if (owner !== userAuth._id) {
                 res.status(401).json({
                    message: "Unauthorized",
                    status: 401
                 });
                 return
            }
             const response = await this.model.findByIdAndUpdate(req.params.id, req.body, {new: true});
             res.status(200).json({
                data: response,
                message: "Post updated",
                status: 200
             });
        } catch (error) {
             res.status(500).json({
                message: error.message,
                status: 500
             });
        }
    
    }

} 

export default new UserPostController(); // override post with owner = user._id later