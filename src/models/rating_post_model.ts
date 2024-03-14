import mongoose, { ObjectId, Schema } from "mongoose"; 
import {IUser} from "./user_model";
import { IUserPost } from "./user_post_model";

export interface IPostRating {
    _id: ObjectId;
    user: ObjectId | IUser
    rating?: string; 
    post: (ObjectId| IUserPost);
    rating_type: number; // 1 for like, -1 for dislike
} 

const ratingPostSchema = new mongoose.Schema<IPostRating>({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    rating: {type: String, required: false},
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    rating_type: {type: Number, required: true}
});

export default mongoose.model<IPostRating>("PostRating", ratingPostSchema);
