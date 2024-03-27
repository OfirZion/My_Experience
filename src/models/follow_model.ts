import mongoose, { ObjectId, Schema } from "mongoose"; 
import { IUser } from "./user_model";

export interface IFollow {
    follower: Schema.Types.ObjectId | IUser
    following: Schema.Types.ObjectId | IUser
    _id?: ObjectId; 
    dateAdded?: Date; 
} 

const followSchema = new mongoose.Schema<IFollow>({
    follower: { type: Schema.Types.ObjectId, ref: "User", required: true},
    following: { type: Schema.Types.ObjectId, ref: "User", required: true},
    dateAdded: {type: Date, required: false}
}); 

export default mongoose.model<IFollow>("Follow", followSchema);