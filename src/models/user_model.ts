import mongoose, { ObjectId, Types } from "mongoose"; //Schema,
import { IUserAuth } from "./user_auth_model";
import { IFollow } from "./follow_model";
import { IUserPost } from "./user_post_model";
import { IUserRating } from "./rating_user_model";

export interface IUser {
    name: string;
    age: number;
    _id?: ObjectId; 
    imgUrl?: string;
    auth: Types.ObjectId | IUserAuth;
    ratings: (Types.ObjectId | IUserRating)[]; // (Many to many)
    posts: (Types.ObjectId | IUserPost)[]; // (Many to many)
    followers: (Types.ObjectId | IFollow)[]; // (Many to many)
    following:  (Types.ObjectId | IFollow)[]; // (Many to many)
} 

const userSchema = new mongoose.Schema<IUser>({
    name: {type: String, required: false,default: "Anonymous"},
    age: {type: Number, required: false, default: 0},
    auth: { type: mongoose.Schema.Types.ObjectId, ref:"UserAuth" }, 
    imgUrl: {type: String, required: false},
    ratings: [{type: mongoose.Schema.Types.ObjectId, ref:"UserRating", required: false}], // {array of ratings}
    posts: [{type: mongoose.Schema.Types.ObjectId, ref:"UserPost", required: false}], // {array of posts}
    followers: [{type: mongoose.Schema.Types.ObjectId, ref:"Follow", required: false}], // {array of following}
    following: [{type: mongoose.Schema.Types.ObjectId, ref:"Follow", required: false}] // {array of followers}
}); 

export default mongoose.model<IUser>("User", userSchema);
