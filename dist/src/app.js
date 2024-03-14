"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_route_1 = __importDefault(require("./routes/user_route"));
// import userAuthRouter from "./routes/user_auth_route";
const user_post_route_1 = __importDefault(require("./routes/user_post_route"));
const user_comment_route_1 = __importDefault(require("./routes/user_comment_route"));
const rating_route_1 = __importDefault(require("./routes/rating_route"));
const follow_route_1 = __importDefault(require("./routes/follow_route"));
const prod_DB_URL = process.env.DB_URL;
const initApp = (url = prod_DB_URL) => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on("error", (error) => console.error(error));
        db.once("open", () => console.log("connected to mongo"));
        mongoose_1.default.connect(url).then(() => {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use(body_parser_1.default.json());
            // ADD ROUTES HERE
            app.use("/users", user_route_1.default);
            // app.use("/auth", userAuthRouter);
            app.use("/posts", user_post_route_1.default);
            app.use("/comments", user_comment_route_1.default);
            app.use("/ratings", rating_route_1.default);
            app.use("/follows", follow_route_1.default);
            //app.use("/public", express.static("public"));
            resolve(app);
        });
    });
    return promise;
};
// app.get("/", (req,res) =>{
//     res.send("get student");
// });
// const port = process.env.PORT;
// app.listen(port, () =>{
//     console.log(`Example at http://localhost:${port}/`);
// }); 
exports.default = initApp;
//# sourceMappingURL=app.js.map