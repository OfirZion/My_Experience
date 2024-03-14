import mongoose, { Schema } from "mongoose"; 
import { IUser } from "./user_model";
import { IUserComment } from "./user_comment_model";
import { IPostRating } from "./rating_post_model";

export interface IUserPost {
    title: string;
    message: string;
    post_owner_name: string;
    post_owner: Schema.Types.ObjectId | IUser
    ratings: (Schema.Types.ObjectId | IPostRating)[];
    imgUrl?: string;
    exp_rating: number;
    comments: (Schema.Types.ObjectId | IUserComment)[];
    created_at?: Date;
} 

const userPostSchema = new mongoose.Schema<IUserPost>({
    title: {type: String, required: true},
    message: {type: String, required: true},
    post_owner_name: {type: String, required: true},
    post_owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    imgUrl: {type: String, required: false},
    exp_rating: {type: Number, required: true},
    ratings: [{type: Schema.Types.ObjectId, ref: "PostRating", required: false}],
    comments: [{type: Schema.Types.ObjectId, ref: "UserComment", required: false}],
    created_at: {type: Date, }
}); 

export default mongoose.model<IUserPost>("UserPost", userPostSchema);