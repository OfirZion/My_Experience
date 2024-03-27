import { Request, Response } from 'express';
import User, { IUser } from '../models/user_model';
import { Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import UserAuth, { IUserAuth } from '../models/user_auth_model';

const client = new OAuth2Client();
/* istanbul ignore next */
const googleSignin = async (req: Request, res: Response) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        if (email != null) {
            let auth = await UserAuth.findOne({ 'email': email }).populate('user');
            //eslint-disable-next-line
            let user = auth?.user as (Document<any, any, IUser> & IUser ) | undefined;
            if (auth == null) {
                user = await User.create(
                    {
                        'email': email,
                        'password': '0',
                        'imgUrl': payload?.picture
                    });
                auth = await UserAuth.create(
                    {
                        'email': email,
                        'password': '0'
                    });
                user.auth = auth._id;
                auth.user = user._id;
                await user.save();
                await auth.save();    
            }
            const tokens = await generateTokens(user, auth)
            return res.status(201).json({
                data:{
                     email: auth.email,
                     _id: user._id,
                     imgUrl: user.imgUrl,
                     ...tokens
                 },
                 message: "User created",
                 status: 201
             })
        }
    } catch (err) {
        console.log(err.message)
        return res.status(400).send(err.message);
    }

}  

const register = async (req: Request, res: Response) => {
    try {
        const { userData, authData } = req.body
        if (!authData.email || !authData.password) {
            return res.status(400).json({
                message: "missing email or password",
                status: 400
            });
        }
        const rs = await UserAuth.findOne({ email: authData.email });
        if (rs) {
            return res.status(406).json({
                message: "Email already exists",
                status: 406
            });
        }
        const user = new User(userData);
        const auth = new UserAuth(authData)

        await user.save()
        await auth.save()
        user.auth = auth._id
        auth.user = user._id
        const savedUser = await user.save();
        await auth.save();
        const tokens = await generateTokens(user, auth)

        return res.status(201).json({
           data:{
                email: auth.email,
                _id: savedUser._id,
                imgUrl: savedUser.imgUrl,
                ...tokens
            },
            message: "User created",
            status: 201
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message,
            status: 400
        });
    }
}

const generateTokens = async (user: IUser, auth: Document<unknown, unknown,IUserAuth> & IUserAuth) => {
    const accessToken = jwt.sign({ email: auth.email, _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }); 
    const refreshToken = jwt.sign({ email: auth.email, _id: user._id }, process.env.REFRESH_TOKEN_SECRET);
    if (auth.refreshTokens == null) {
        auth.refreshTokens = [refreshToken];
    } else {
        auth.refreshTokens.push(refreshToken);
    }
     await auth.save();
    return { accessToken, refreshToken };
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "missing email or password",
            status: 400
        });
    }
    try {
        const auth: Document<unknown,unknown, IUserAuth> & IUserAuth = await UserAuth.findOne({ email }).populate('user');
        if (!auth) {
            return res.status(401).json({
                message: "email or password incorrect",
                status: 401
            });
        }
        const user = auth.user as IUser;
        if (!auth.comparePassword(password)) {
            return res.status(401).json({
                message: "email or password incorrect",
                status: 401
            });
        }
        const tokens = await generateTokens(user, auth)
        return res.status(200).json({
            data:tokens,
            message: "login success",
            status: 200
        });
    } catch (err) {
        return res.status(400).json({
            message: "error missing email or password",
            status: 400
        });
    }
}

const logout = async (req: Request, res: Response) => {
    const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string; 
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null) return res.status(401).json({
        message: "missing refresh token",
        status: 401
    });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user: { _id: string, email:string }) => {
        if (err) return res.status(401).json({
            message: "invalid refresh token",
            status: 401
        });
        try {
            const userDb = await UserAuth.findOne({user: user._id});
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save(); 
                return res.status(401).json({
                    message: "invalid refresh token",
                    status: 401
                });
            } else {
                userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
                await userDb.save();
                return res.status(200).json({
                    message: "logout success",
                    status: 200,
                    data: userDb 
                });
            }
        } catch (err) {
            res.status(401).json({
                message: err.message,
                status: 401
            });
        }
    });
}

const refresh = async (req: Request, res: Response) => {
    const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string;  
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null) return res.status(401).json({
        message: "missing refresh token",
        status: 401
    });
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user: { _id: string, email:string }) => {
        if (err) {
            return res.status(401).json({
                message: "invalid refresh token",
                status: 401
            });
        }
        try {
            const authDb = await UserAuth.findOne({ user: user._id });
            if (!authDb.refreshTokens || !authDb.refreshTokens.includes(refreshToken)) {
                authDb.refreshTokens = [];
                await authDb.save(); 
                return res.status(401).json({
                    message: "invalid refresh token",
                    status: 401
                });
            }
            const accessToken = jwt.sign({ _id: user._id, email: authDb.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
            const newRefreshToken = jwt.sign({ _id: user._id, email: authDb.email }, process.env.REFRESH_TOKEN_SECRET);
            authDb.refreshTokens = authDb.refreshTokens.filter(t => t !== refreshToken);
            authDb.refreshTokens.push(newRefreshToken);
            await authDb.save();
            return res.status(200).send({
                data:{
                    'accessToken': accessToken,
                    'refreshToken': newRefreshToken
                },
                message: "refresh success",
                status: 200
            });
        } catch (err) {
            res.status(401).json({
                message: err.message,
                status: 401
            });
        }
    });
}




export default {
    googleSignin,
    register,
    login,
    logout,
    refresh
}