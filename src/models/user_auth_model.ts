import mongoose, { Schema, Types, UpdateQuery } from "mongoose";
import { IUser } from "./user_model";
import { hashSync, compareSync } from 'bcrypt'

export interface IUserAuth {
    email: string;
    password: string; // _id?: ObjectId; ?
    refreshTokens?: string[]; //  ObjectId[] ?
    user?: (Types.ObjectId | IUser | Schema.Types.ObjectId)
    comparePassword?: (candidatePassword: string) => boolean; 
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
        const hash = hashSync(this.password, 10);
        this.password = hash;
    }
    next();
});

userAuthSchema.pre("findOneAndUpdate", async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: UpdateQuery<any> = this.getUpdate();
    if (update.password) {
        const hash = hashSync(update.password, 10);
        update.password = hash;
    }
    next();
});
userAuthSchema.methods.comparePassword = function (candidatePassword: string) {
    return compareSync(candidatePassword, this.password);
}

export default mongoose.model<IUserAuth>("UserAuth", userAuthSchema);