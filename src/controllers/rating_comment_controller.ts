import { BaseController } from './base_controller';
import CommentRating,{ICommentRating}  from '../models/rating_comment_model';
import {Request, Response} from 'express';
import Comment from '../models/user_comment_model';
class RatingCommentController extends BaseController<ICommentRating> {
    constructor(){
        super(CommentRating);
    }


    async post(req: Request, res: Response) {
        // rate a comment
        const userAuth = req.user
        const ratingBody = req.body;
        const commentId = req.params.id;
        try {
            const newRating = await this.model.create({
                user: userAuth._id,
                comment: commentId,
                rating_type: ratingBody.rating_type
            });

            // add the rating to the comment
            await Comment.findByIdAndUpdate(commentId, { $push: { ratings: newRating._id } });
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
    async put (req:Request, res: Response) {
        res.status(405).json({
            message: "Method not allowed",
            status: 405
        });
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

            const owner = rating.user.toString()
            if (owner !== userAuth._id) {
                res.status(401).json({
                    message: "Unauthorized",
                    status: 401
                });
                return
            }

            await Comment.findByIdAndUpdate(rating.comment, { $pull: { ratings: rating._id } })
            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).json({
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

export default new RatingCommentController(); 