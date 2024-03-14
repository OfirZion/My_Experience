// import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import UserComment, { IUserComment } from '../models/user_comment_model';
import UserPost, { IUserPost } from '../models/user_post_model';
import{
    Request,
    Response
} from 'express';
import { ObjectId } from 'mongoose';

class UserCommentController extends BaseController<IUserComment>{
    constructor() {
        super(UserComment);
    }

    
    async post(
        req: Request, 
        res: Response
    ) {
        const commentBody = req.body;
        const userAuth = req.user
        const postId = req.params.id

        try {
            let newComment = await this.model.create({
                ...commentBody,
                comment_owner: userAuth._id,
                post: postId
            });

            newComment = await newComment.populate(['comment_owner', 'ratings'])
            // add the comment into the post
            await UserPost.findByIdAndUpdate(postId, {  $push: { comments: newComment._id } })
            res.status(201).json({
                data: newComment,
                message: "Comment created",
                status: 201
            });
        } catch (error) {
            res.status(406).json({
                message: error.message,
                status: 406
            });
        }
    }

    async delete(
        req: Request, 
        res: Response
    ) {
        try {
            const userAuth = req.user;
            const comment = await this.model.findById(req.params.id).populate(['comment_owner', 'post', 'ratings']);
            if (comment == null) {
                res.status(404).json({
                    message: "Comment not found",
                    status: 404
                });
                return
            }
            const owner = (comment.comment_owner as ObjectId).toString()
            const post = comment.post as IUserPost
            if (owner !== userAuth._id && userAuth._id != post.post_owner.toString()  ) {
                res.status(401).json({
                    message: "Unauthorized",
                    status: 401
                });
                return
            }
            // remove the comment from the post
            await UserPost.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } })
            // remove the comment
            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: "Comment deleted",
                status: 200,
                data:comment
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }

    async get(
        req: Request, 
        res: Response
    ) {
        try {
            const comments = await this.model.find({ post: req.params.id });
            res.status(200).json({
                data: comments,
                message: "Data found - get",
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }

    async put(
        req: Request, 
        res: Response
    ) {
        try {
            const userAuth = req.user;
            const comment = await this.model.findById(req.params.id);
            if (comment == null) {
                res.status(404).json({
                    message: "Comment not found",
                    status: 404
                });
                return
            }
            const owner = (comment.comment_owner as ObjectId).toString()
            if (owner !== userAuth._id) {
                res.status(401).json({
                    message: "Unauthorized",
                    status: 401
                });
                return
            }
            const updatedComment = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({
                data: updatedComment,
                message: "Comment updated",
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

export default new UserCommentController(); // override post with owner = user._id later