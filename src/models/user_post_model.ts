import mongoose, { Schema } from "mongoose"; 

export interface IUserPost{
    title: string;
    message: string;
    post_owner_name: string;
    post_owner_id: {type: Schema.Types.String, ref: "User"};
    imgUrl?: string;
    exp_rating: number;
    num_of_comments?: number;
} 

const userPostSchema = new mongoose.Schema<IUserPost>({
    title: {type: String, required: true},
    message: {type: String, required: true},
    post_owner_name: {type: String, required: true},
    post_owner_id: {type: Schema.Types.String, ref: "User", required: true},
    imgUrl: {type: String, required: false},
    exp_rating: {type: Number, required: true},
    num_of_comments: {type: Number, required: false}
}); 

export default mongoose.model<IUserPost>("UserPost", userPostSchema);