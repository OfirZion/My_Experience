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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const user_auth_route_1 = __importDefault(require("./routes/user_auth_route"));
const user_post_route_1 = __importDefault(require("./routes/user_post_route"));
const user_comment_route_1 = __importDefault(require("./routes/user_comment_route"));
const rating_user_route_1 = __importDefault(require("./routes/rating_user_route"));
const rating_post_route_1 = __importDefault(require("./routes/rating_post_route"));
const rating_comment_route_1 = __importDefault(require("./routes/rating_comment_route"));
const follow_route_1 = __importDefault(require("./routes/follow_route"));
const prod_DB_URL = process.env.DB_URL;
const initApp = (url = prod_DB_URL) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(url);
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    // ADD ROUTES HERE
    app.use("/users", user_route_1.default);
    app.use("/auth", user_auth_route_1.default);
    app.use("/posts", user_post_route_1.default);
    app.use("/comments", user_comment_route_1.default);
    app.use("/userRatings", rating_user_route_1.default);
    app.use("/postRatings", rating_post_route_1.default);
    app.use("/commentRatings", rating_comment_route_1.default);
    app.use("/follows", follow_route_1.default);
    //app.use("/public", express.static("public"));
    return app;
});
// app.get("/", (req,res) =>{
//     res.send("get student");
// });
// const port = process.env.PORT;
// app.listen(port, () =>{
//     console.log(`Example at http://localhost:${port}/`);
// }); 
exports.default = initApp;
//# sourceMappingURL=app.js.map