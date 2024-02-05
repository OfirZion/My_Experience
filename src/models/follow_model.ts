import mongoose, { Schema } from "mongoose"; 

export interface IFollow{
    followerID: {type: Schema.Types.ObjectId, ref: "User"};
    followingID: {type: Schema.Types.ObjectId, ref: "User"};
    //dateAdded: Date; ?
} 

const followSchema = new mongoose.Schema<IFollow>({
    followerID: {type: Schema.Types.ObjectId, ref: "User", required: true},
    followingID: {type: Schema.Types.ObjectId, ref: "User", required: true},
    //dateAdded: {type: Date, required: true}
}); 

export default mongoose.model<IFollow>("Follow", followSchema);