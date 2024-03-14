import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/user_route";
import userAuthRouter from "./routes/user_auth_route";
import userPostRouter from "./routes/user_post_route";
import userCommentRouter from "./routes/user_comment_route";
import ratingUserRouter from "./routes/rating_user_route";
import ratingPostRouter from "./routes/rating_post_route";
import ratingCommentRouter from "./routes/rating_comment_route";
import followRouter from "./routes/follow_route";
const prod_DB_URL = process.env.DB_URL;


const initApp = async (url = prod_DB_URL): Promise<Express> => {
    await mongoose.connect(url!)
    const app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    // ADD ROUTES HERE
    app.use("/users", userRouter);
    app.use("/auth", userAuthRouter);
    app.use("/posts", userPostRouter);
    app.use("/comments", userCommentRouter);
    app.use("/userRatings", ratingUserRouter);
    app.use("/postRatings", ratingPostRouter);
    app.use("/commentRatings", ratingCommentRouter);
    app.use("/follows", followRouter);
    //app.use("/public", express.static("public"));
    return app
}

// app.get("/", (req,res) =>{
//     res.send("get student");
// });
// const port = process.env.PORT;
// app.listen(port, () =>{
//     console.log(`Example at http://localhost:${port}/`);
// }); 

export default initApp;