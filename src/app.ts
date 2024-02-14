import express, {Express} from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import mongoose from "mongoose";
const prod_DB_URL = process.env.DB_URL;


const initApp = (url=prod_DB_URL): Promise<Express> => { 
    const promise = new Promise<Express>((resolve) => {
       
        const db = mongoose.connection;
        db.on("error", (error) => console.error(error));
        db.once("open", () => console.log("connected to mongo"));
        mongoose.connect(url!).then(() => { 
            const app = express();
            app.use(bodyParser.urlencoded({ extended:true})); 
            app.use(bodyParser.json());
            resolve(app);
        });
        // ADD ROUTES HERE
    });
           
    return promise;
}

// app.get("/", (req,res) =>{
//     res.send("get student");
// });
// const port = process.env.PORT;
// app.listen(port, () =>{
//     console.log(`Example at http://localhost:${port}/`);
// }); 

export default initApp;