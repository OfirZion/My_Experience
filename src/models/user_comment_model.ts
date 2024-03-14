import mongoose, {Schema} from "mongoose"; 
import { IUser } from "./user_model";
import { IUserPost } from "./user_post_model";
import { ICommentRating } from "./rating_comment_model";

export interface IUserComment {
    message: string;
    post: (Schema.Types.ObjectId | IUserPost); 
    ratings: (Schema.Types.ObjectId | ICommentRating)[];
    comment_owner_name: string;
    comment_owner: (Schema.Types.ObjectId | IUser); // (Many to one
} 

const userCommentSchema = new mongoose.Schema<IUserComment>({
    message: {type: String, required: true},
    comment_owner_name: {type: String, required: true},
    post: {type: Schema.Types.ObjectId, ref: "UserPost", required: true},
    ratings: [{type: Schema.Types.ObjectId, ref: "CommentRating", required: false}],
    comment_owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
});

export default mongoose.model<IUserComment>("UserComment", userCommentSchema);