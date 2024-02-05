import mongoose from "mongoose"; 

export interface IUser{
    name: string;
    age: number;
    //_id?: string;
    imgUrl?: string;
    my_rating: number;
} 

const userSchema = new mongoose.Schema<IUser>({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    imgUrl: {type: String, required: false},
    my_rating: {type: Number, required: true}
}); 

export default mongoose.model<IUser>("User", userSchema);
