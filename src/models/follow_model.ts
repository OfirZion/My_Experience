import mongoose, { Schema } from "mongoose"; 

export interface IFollow{
    followerID: {type: Schema.Types.String, ref: "User"};
    followingID: {type: Schema.Types.String, ref: "User"};
    dateAdded?: Date; //not sure if should be not required?
} 

const followSchema = new mongoose.Schema<IFollow>({
    followerID: {type: Schema.Types.String, ref: "User", required: true},
    followingID: {type: Schema.Types.String, ref: "User", required: true},
    dateAdded: {type: Date, required: false}
}); 

export default mongoose.model<IFollow>("Follow", followSchema);