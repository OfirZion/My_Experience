"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = (req.headers['authorization'] || req.headers['Authorization']);
    if (authHeader) { // kasndlkasnd
        const token = authHeader.split('Bearer ')[1];
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(401).json({
                    message: err,
                    status: 401
                });
            }
            else {
                req.user = user;
                next();
            }
        });
    }
    else {
        res.status(401).json({
            message: "Unauthorized",
            status: 401
        });
    }
};
exports.default = authMiddleware; // ADD AUTH MIDDLEWARE, bind to userController
//# sourceMappingURL=auth_middleware.js.map