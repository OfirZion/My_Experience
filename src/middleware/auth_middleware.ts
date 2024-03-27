

import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserAuthT } from "../types/@Types";

const authMiddleware: RequestHandler = (req, res, next) => {
    const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string;
    if (authHeader) { // kasndlkasnd
        const token = authHeader.split('Bearer ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user: UserAuthT) => {
            if (err) {
                res.status(401).json({
                    message: err,
                    status: 401
                });
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        res.status(401).json({
            message: "Unauthorized",
            status: 401
        });
    }
}


export default authMiddleware; // ADD AUTH MIDDLEWARE, bind to userController