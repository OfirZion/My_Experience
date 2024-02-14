import mongoose, { Schema } from "mongoose"; 

export interface IRating{
    userID: {type: Schema.Types.String, ref: "User"};
    item_type: string; // via either instance.constructor.modelName or model.collection.collectionName NEED TO VERIFY IT'S STRING
    item_id: {type:Schema.Types.ObjectId};
    rating_type: number; // 1 for like, -1 for dislike
} 

const ratingSchema = new mongoose.Schema<IRating>({
    userID: {type: Schema.Types.String, ref: "User", required: true},
    item_type: {type: String, required: true},
    item_id: {type: Schema.Types.ObjectId, required: true},
    rating_type: {type: Number, required: true}
});

export default mongoose.model<IRating>("Rating", ratingSchema);
