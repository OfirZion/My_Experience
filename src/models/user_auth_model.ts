import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./user_model";
import { hashSync, compareSync } from 'bcrypt'

export interface IUserAuth {
    email: string;
    password: string; // _id?: ObjectId; ?
    refreshTokens?: string[]; //  ObjectId[] ?
    user?: (Types.ObjectId | IUser | Schema.Types.ObjectId)
    comparePassword?: (candidatePassword: string) => boolean; // ? is this correct
}

const userAuthSchema = new mongoose.Schema<IUserAuth>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    refreshTokens: { type: [String], required: false }
});


// pre save function
userAuthSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // hash password
        this.password = hashSync(this.password, 10);
    }
    next()
});

userAuthSchema.methods.comparePassword = function (candidatePassword: string) {
    return compareSync(candidatePassword, this.password);
}

export default mongoose.model<IUserAuth>("UserAuth", userAuthSchema);