"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import { OAuth2Client } from 'google-auth-library';
const user_auth_model_1 = __importDefault(require("../models/user_auth_model"));
// const client = new OAuth2Client();
// const googleSignin = async (req: Request, res: Response) => {
//     console.log(req.body);
//     try {
//         const ticket = await client.verifyIdToken({
//             idToken: req.body.credential,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });
//         const payload = ticket.getPayload();
//         const email = payload?.email;
//         if (email != null) {
//             let user = await User.findOne({ 'email': email });
//             if (user == null) {
//                 user = await User.create(
//                     {
//                         'email': email,
//                         'password': '0',
//                         'imgUrl': payload?.picture
//                     });
//             }
//             const tokens = await generateTokens(user)
//             res.status(200).send(
//                 {
//                     email: user.email,
//                     _id: user._id,
//                     imgUrl: user.imgUrl,
//                     ...tokens
//                 })
//         }
//     } catch (err) {
//         return res.status(400).send(err.message);
//     }
// }  
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userData, authData } = req.body;
        if (!authData.email || !authData.password) {
            return res.status(400).json({
                message: "missing email or password",
                status: 400
            });
        }
        const rs = yield user_auth_model_1.default.findOne({ email: authData.email });
        if (rs) {
            return res.status(406).json({
                message: "Email already exists",
                status: 406
            });
        }
        const user = new user_model_1.default(userData);
        const auth = new user_auth_model_1.default(authData);
        yield user.save();
        yield auth.save();
        user.auth = auth._id;
        auth.user = user._id;
        const savedUser = yield user.save();
        yield auth.save();
        const tokens = yield generateTokens(user, auth);
        return res.status(201).json({
            data: Object.assign({ email: auth.email, _id: savedUser._id, imgUrl: savedUser.imgUrl }, tokens),
            message: "User created",
            status: 201
        });
    }
    catch (err) {
        return res.status(400).json({
            message: err.message,
            status: 400
        });
    }
});
// const generateTokens = async (user: Document & IUser) => {
//     const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
//     const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
//     if (user.refreshTokens == null) {
//         user.refreshTokens = [refreshToken];
//     } else {
//         user.refreshTokens.push(refreshToken);
//     }
//     await user.save();
//     return {
//         'accessToken': accessToken,
//         'refreshToken': refreshToken
//     };
// } 
const generateTokens = (user, auth) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jsonwebtoken_1.default.sign({ email: auth.email, _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ email: auth.email, _id: user._id }, process.env.REFRESH_TOKEN_SECRET);
    return { accessToken, refreshToken };
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "missing email or password",
            status: 400
        });
    }
    try {
        const auth = yield user_auth_model_1.default.findOne({ email }).populate('user');
        if (!auth) {
            return res.status(401).json({
                message: "email or password incorrect",
                status: 401
            });
        }
        const user = auth.user;
        if (!auth.comparePassword(password)) {
            return res.status(401).json({
                message: "email or password incorrect",
                status: 401
            });
        }
        const tokens = yield generateTokens(user, auth);
        return res.status(200).json({
            data: tokens,
            message: "login success",
            status: 200
        });
    }
    catch (err) {
        return res.status(400).json({
            message: "error missing email or password",
            status: 400
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null)
        return res.status(401).json({
            message: "missing refresh token",
            status: 401
        });
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(err);
        if (err)
            return res.status(401).json({
                message: "invalid refresh token",
                status: 401
            });
        try {
            const userDb = yield user_auth_model_1.default.findById(user._id);
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.status(401).json({
                    message: "invalid refresh token",
                    status: 401
                });
            }
            else {
                userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
                yield userDb.save();
                return res.status(200).json({
                    message: "logout success",
                    status: 200,
                    data: userDb
                });
            }
        }
        catch (err) {
            res.status(401).json({
                message: err.message,
                status: 401
            });
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null)
        return res.status(401).json({
            message: "missing refresh token",
            status: 401
        });
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.status(401).json({
                message: "invalid refresh token",
                status: 401
            });
        }
        try {
            const userDb = yield user_auth_model_1.default.findById(user._id);
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.status(401).json({
                    message: "invalid refresh token",
                    status: 401
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            yield userDb.save();
            return res.status(200).send({
                data: {
                    'accessToken': accessToken,
                    'refreshToken': refreshToken
                },
                message: "refresh success",
                status: 200
            });
        }
        catch (err) {
            res.status(401).json({
                message: err.message,
                status: 401
            });
        }
    }));
});
exports.default = {
    //googleSignin,
    register,
    login,
    logout,
    refresh
};
//# sourceMappingURL=user_auth_controller.js.map