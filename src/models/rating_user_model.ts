import mongoose, { ObjectId, Schema } from "mongoose"; 
import { IUser } from "./user_model";

export interface IUserRating {
    rating_user: (ObjectId | IUser)
    rated_user: (ObjectId | IUser);
    rating: string 
    rating_type: number; // 0-10
} 

const ratingUserSchema = new mongoose.Schema<IUserRating>({
    rating_user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    rated_user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    rating: {type: String, required: true},
    rating_type: {type: Number, min: 0, max: 10, required: true}
});

export default mongoose.model<IUserRating>("UserRating", ratingUserSchema);
