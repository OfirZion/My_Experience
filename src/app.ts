import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
//import mongoose from "mongoose";
const app = express();
const port = process.env.PORT;

// mongoose.connect(process.env.DB_URL!); 
// const db = mongoose.connection;
// db.on("error",(error) => console.error(error));
// db.once("open", ()=> console.log("connected to mongo"));

app.use(bodyParser.urlencoded({ extended:true})); 
app.use(bodyParser.json());

app.get("/", (req,res) =>{
    res.send("get student");
});

app.listen(port, () =>{
    console.log(`Example at http://localhost:${port}/`);
}); 

export default app;