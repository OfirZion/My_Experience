import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
//import UserAuth from "../models/user_auth_model"; 
import initApp from "../app";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
// let accessToken: string;



beforeAll(async () => {
  appInstance = await initApp(test_DB_URL);
  console.log("beforeAll");
  await User.deleteMany({});

//   User.deleteMany({ 'email': user.email });
//   await request(app).post("/auth/register").send(user);
//   const response = await request(app).post("/auth/login").send(user);
//   accessToken = response.body.accessToken;
}); 

afterAll(async () => {
  await mongoose.connection.close();
  console.log("afterAll");
});

const testUser : IUser = { name: "test", age: 20, imgUrl: "", my_rating: 0 };

describe("UserTests", () => { 
    test("Get Users - Empty", async () => {
        const response = await request(appInstance).get("/users");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    // should be used with a dedicated function addUser to validate typing
    test("Post User", async () => {
        const response = await request(appInstance).post("/users").send(testUser);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(testUser.name);
    });

    test("Get User - 1 User", async () => { 
        // const user = new User(testUser); // should be in the controller, applied in test above, need to refactor
        // await user.save();
        const response = await request(appInstance).get("/users");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe(testUser.name);
    });
    
});