import mongoose from "mongoose"; 

export interface IUserAuth{
    email: string;
    password: number;
    //_id?: string;
    refreshTokens?: string[];
} 

const userAuthSchema = new mongoose.Schema<IUserAuth>({
    email: {type: String, required: true},
    password: {type: Number, required: true},
    refreshTokens: {type: [String], required: false}
}); 

export default mongoose.model<IUserAuth>("UserAuth", userAuthSchema); 