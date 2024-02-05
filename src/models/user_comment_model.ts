import mongoose from "mongoose"; 

export interface IUserComment{
    title: string;
    message: string;
    comment_owner_name: string;
    comment_owner_id: string;
    comment_father_id: string;
} 

const userCommentSchema = new mongoose.Schema<IUserComment>({
    title: {type: String, required: true},
    message: {type: String, required: true},
    comment_owner_name: {type: String, required: true},
    comment_owner_id: {type: String, required: true},
    comment_father_id: {type: String, required: true}
});

export default mongoose.model<IUserComment>("UserComment", userCommentSchema);