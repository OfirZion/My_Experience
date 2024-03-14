import { BaseController } from "./base_controller";
import User, { IUser } from "../models/user_model";
import { Request, Response } from "express";

class UserController extends BaseController<IUser>{
    constructor() {
        super(User);
    }

    async get(req: Request, res: Response){
        try {
            if(req.query.name){ 
                const response = await this.model.find({name: req.query.name}).populate({
                    path: "auth",
                    select: ["-password", "-refreshTokens"]
                });
                res.status(200).json({
                    data: response,
                    message: "Data found - get",
                    status: 200
                })
            } else {
                const response = await this.model.find().populate({
                    path: "auth",
                    select: ["-password", "-refreshTokens"]
                }); 
                res.status(200).json({
                    data: response,
                    message: "Data found - get",
                    status: 200
                });
            }   
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }
    async getById(req: Request, res: Response) {
        try {
            const response = await this.model.findById(req.params.id).populate([
                {
                    path: "auth",
                    select: ["-password", "-refreshTokens"]
                },
                {
                    path: "followers",
                    populate: {
                        path: "follower",
                    }
                },
                {
                    path: "following",
                    populate: {
                        path: "following",
                    }
                },
                {
                    path: "posts",
                    populate: {
                        path: "ratings",
                        model: "PostRating"
                    }
                },
                {path: "ratings", model: "UserRating"}
            ]);
            res.status(200).json({
                data: response,
                message: "Data found - getById",
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }
    
    async me(req: Request, res: Response) {
        try {
            const response = await this.model.findById(req.user._id).populate([
                {path: "auth", model: "UserAuth" },
                {path: "followers", populate: {path: "follower", model: "User" }},
                {path: "following", populate: {path: "following", model: "User" }},
                {path: "ratings", model: "UserRating"}
            ]);
            res.status(200).json({
                data: response,
                message: "Data found - me",
                status: 200
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }
}

export default new UserController(); // override post with _id later

