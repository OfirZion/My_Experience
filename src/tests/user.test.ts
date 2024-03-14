import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import { Express } from "express";
import UserAuth from "../models/user_auth_model";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
let accessToken: string | undefined;


beforeAll(async () => {
  appInstance = await initApp(test_DB_URL);
  console.log("beforeAll");
  await User.deleteMany(); // ({});
  await UserAuth.deleteMany(); // ({});

});

afterAll(async () => {
  await mongoose.disconnect();
  console.log("afterAll");
});


const testUserRegisterForm = {
  _id: undefined,
  authData: {
    email: "test@gmail.com",
    password: "123456Aa!"
  },
  userData: {
    name: "test",
    age: 20, imgUrl: "", my_rating: 0,
    followers: [],
    following: []
  }
};


describe("UserTests", () => {
  test("Get Users - Empty", async () => {
    const response = await request(appInstance).get("/users");
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual([]);
  });



  test("Post User", async () => {
    const response = await request(appInstance).post("/auth/register").send(testUserRegisterForm);
    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    testUserRegisterForm._id = response.body.data._id; 
  });

  test("Get User - 1 User", async () => {
    // const user = new User(testUser); // should be in the controller, applied in test above, need to refactor
    // await user.save();
    const response = await request(appInstance).get("/users");
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe(testUserRegisterForm.userData.name);
    expect(response.body.data[0]._id).toBe(testUserRegisterForm._id);
  });

  test("Test duplicate user", async () => {
    const response = await request(appInstance)
      .post("/auth/register")
      .send(testUserRegisterForm) // Try again to register with same user
    expect(response.status).toBe(406);
    //expect(response.text).toEqual("User with this email already exists");
    expect(response.body.message).toEqual("Email already exists");
  });


  test("Login user", async () => {
    const response = await request(appInstance)
      .post("/auth/login")
      .send({
        email: testUserRegisterForm.authData.email,
        password: testUserRegisterForm.authData.password
      });

    accessToken = response.body.data.accessToken; 
    expect(response.status).toBe(200);
    expect(accessToken).toBeDefined();
  });

  test("Me", async () => {
    const response = await request(appInstance)
      .get("/users/me")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(testUserRegisterForm.userData.name);
    expect(response.body.data._id).toBe(testUserRegisterForm._id);
    
  });


  test("Get User by ID", async () => {
    const response = await request(appInstance)
      .get("/users/" + testUserRegisterForm._id)
      .set("Authorization", "Bearer " + accessToken);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(testUserRegisterForm.userData.name);
  });

  /*test("Update User", async () => {
    const response = await request(appInstance).put("/users/" + testUser._id).send({... testUser, name: "newName" });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("newName");
  }); 

  test("Delete User", async () => {
    const response = await request(appInstance).delete("/users/" + testUser._id);
    expect(response.status).toBe(200);
    //expect(response.body.name).toBe("newName");
  }); */
});