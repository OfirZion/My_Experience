import mongoose, { Schema } from "mongoose"; 

export interface IRating{
    userID: {type: Schema.Types.ObjectId, ref: "User"};
    // item_type: ObjectId;
    item_id: Schema.Types.ObjectId;
    rating_type: number; // +1 for like, -1 for dislike
} 

const ratingSchema = new mongoose.Schema<IRating>({
    userID: {type: Schema.Types.ObjectId, ref: "User", required: true},
    // item_type: {type: ObjectId, required: true},
    item_id: {type: Schema.Types.ObjectId, required: true},
    rating_type: {type: Number, required: true}
});

export default mongoose.model<IRating>("Rating", ratingSchema);