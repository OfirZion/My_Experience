import mongoose, { ObjectId, Schema } from "mongoose"; 
import { IUserComment } from "./user_comment_model";
import { IUser } from "./user_model";

export interface ICommentRating {
    user: (ObjectId | IUser)
    comment: (ObjectId | IUserComment);
    rating_type: number; // 1 for like, -1 for dislike
} 

const ratingCommentSchema = new mongoose.Schema<ICommentRating>({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    comment: {type: Schema.Types.ObjectId, ref: "UserComment", required: true},
    rating_type: {type: Number, required: true}
});

export default mongoose.model<ICommentRating>("CommentRating", ratingCommentSchema);