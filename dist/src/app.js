"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
//import mongoose from "mongoose";
const app = (0, express_1.default)();
const port = process.env.PORT;
// mongoose.connect(process.env.DB_URL!); 
// const db = mongoose.connection;
// db.on("error",(error) => console.error(error));
// db.once("open", ()=> console.log("connected to mongo"));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.send("get student");
});
app.listen(port, () => {
    console.log(`Example at http://localhost:${port}/`);
});
//vsdvdsdfd
exports.default = app;
//# sourceMappingURL=app.js.map