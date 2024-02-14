import mongoose, {Schema} from "mongoose"; 

export interface IUserComment{
    title: string;
    message: string;
    comment_owner_name: string;
    comment_owner_id: {type: Schema.Types.String, ref: "User"};
    comment_father_id: {type: Schema.Types.ObjectId};
} 

const userCommentSchema = new mongoose.Schema<IUserComment>({
    title: {type: String, required: true},
    message: {type: String, required: true},
    comment_owner_name: {type: String, required: true},
    comment_owner_id: {type: Schema.Types.String, ref: "User", required: true},
    comment_father_id: {type: Schema.Types.ObjectId, required: true}
});

export default mongoose.model<IUserComment>("UserComment", userCommentSchema);