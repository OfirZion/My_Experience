import mongoose from "mongoose"; 

export interface IUser{
    name: string;
    age: number;
    _id: string; // change to reference IF CAUSES ISSUES WHEN UPDATING USER_AUTH 
    imgUrl?: string;
    my_rating: number;
    follower_count?: number;
    following_count?: number;
} 

const userSchema = new mongoose.Schema<IUser>({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    _id: {type: String, required: true},
    imgUrl: {type: String, required: false},
    my_rating: {type: Number, required: true},
    follower_count: {type: Number, required: false},
    following_count: {type: Number, required: false}
}); 

export default mongoose.model<IUser>("User", userSchema);
