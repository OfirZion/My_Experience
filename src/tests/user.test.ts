import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import { Express } from "express";
import UserAuth from "../models/user_auth_model";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
let accessToken: string | undefined;
let refreshToken: string| undefined;
let newRefreshToken: string| undefined;


beforeAll(async () => {
  appInstance = await initApp(test_DB_URL);
  await User.deleteMany(); 
  await UserAuth.deleteMany(); 

});

afterAll(async () => {
  await mongoose.disconnect();
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


test("Post User - Missing email/password error", async () => { 
    const response = await request(appInstance).post("/auth/register").send({
      userData: {
        name: "test",
        age: 20, imgUrl: "", my_rating: 0,
        followers: [],
        following: []
      },
      authData: {
        email: "test@gmail.com"
      } 
    }); 
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("missing email or password");
  });

  test("Post User", async () => {
    const response = await request(appInstance).post("/auth/register").send(testUserRegisterForm);
    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    testUserRegisterForm._id = response.body.data._id; 
  });

  test("Post User - Invalid Body error", async () => { 
    const response = await request(appInstance).post("/auth/register").send("123");
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Cannot read properties");
  });

  test("Get User - 1 User", async () => {
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
    expect(response.body.message).toEqual("Email already exists");
  });

  test("Login user - Missing email/password error", async () => {
    const response = await request(appInstance)
      .post("/auth/login")
      .send({
        email: testUserRegisterForm.authData.email
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual("missing email or password");
  }); 

  test("Login user - Incorrect email", async () => {
    const response = await request(appInstance)
      .post("/auth/login")
      .send({
        email: "testUserRegisterForm@authData.email",
        password: testUserRegisterForm.authData.password
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toEqual("email or password incorrect");
  }); 

  test("Login user - Incorrect password", async () => {
    const response = await request(appInstance)
      .post("/auth/login")
      .send({
        email: testUserRegisterForm.authData.email,
        password: "testUserRegisterForm.authData.password"
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toEqual("email or password incorrect");
  }); 

  test("Login user", async () => {
    const response = await request(appInstance)
      .post("/auth/login")
      .send({
        email: testUserRegisterForm.authData.email,
        password: testUserRegisterForm.authData.password
      });
    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeDefined(); 
    expect(response.body.data.refreshToken).toBeDefined(); 
    accessToken = response.body.data.accessToken; 
    refreshToken = response.body.data.refreshToken;
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


  test("Get User by query name", async () => { 
    const response = await request(appInstance)
      .get("/users?name=" + testUserRegisterForm.userData.name)
      .set("Authorization", "Bearer " + accessToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe("Data found - get");
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe(testUserRegisterForm.userData.name);
    expect(response.body.data[0]._id).toBe(testUserRegisterForm._id);
  });
    

  test("Get User by ID", async () => {
    const response = await request(appInstance)
      .get("/users/" + testUserRegisterForm._id)
      .set("Authorization", "Bearer " + accessToken);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(testUserRegisterForm.userData.name);
  });

  test("Get User by ID - Invalid ID Error", async () => {
    const response = await request(appInstance)
      .get("/users/123")
      .set("Authorization", "Bearer " + accessToken);
    expect(response.status).toBe(500);
    expect(response.body.message).toContain("Cast to ObjectId failed");
  }); 

  test("Get User by ID - Missing Token Error", async () => {
    const response = await request(appInstance)
      .get("/users/" + testUserRegisterForm._id);
    expect(response.status).toBe(401);
  });

  test("Get User by ID - Invalid Token Error", async () => {
    const response = await request(appInstance)
      .get("/users/" + testUserRegisterForm._id)
      .set("Authorization", "Bearerqw" + accessToken);
    expect(response.status).toBe(401);
  });


  test("Update User", async () => {
    const response = await request(appInstance)
      .put("/users")
      .set("Authorization", "Bearer " + accessToken)
      .send({ ...testUserRegisterForm, userData: { ...testUserRegisterForm.userData, name: "newName",age:23, imgUrl: "newImg" }, authData: { ...testUserRegisterForm.authData} });
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("newName");
    expect(response.body.data.age).toBe(23);
    expect(response.body.data.imgUrl).toBe("newImg");
    testUserRegisterForm.userData.name = response.body.data.name;
    testUserRegisterForm.userData.age = response.body.data.age;
    testUserRegisterForm.userData.imgUrl = response.body.data.imgUrl;
  });

  test("Update User - Invalid Body error", async () => {
    const response = await request(appInstance)
      .put("/users")
      .set("Authorization", "Bearer " + accessToken)
      .send("123");
      expect(response.status).toBe(500);
      expect(response.body.message).toContain("Cannot read properties");
  });

  jest.setTimeout(8000);
  test("Test access after timeout of token", async () => {
    await new Promise((resolve) => setTimeout(resolve, 6000))
    const response = await request(appInstance)
      .get("/users/" + testUserRegisterForm._id)
      .set("Authorization", "Bearer " + accessToken);
    expect(response.status).not.toBe(200);
  });

  test("Refresh Token - Missing Token Error", async () => {
    const response = await request(appInstance)
      .get("/auth/refresh");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("missing refresh token");
  }); 

  test("Refresh Token - Invalid Token Error", async () => {
    const response = await request(appInstance)
      .get("/auth/refresh")
      .set("Authorization", "Bearer qw" + refreshToken);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("invalid refresh token");
  }); 


  test("Refresh Token", async () => {
    const response = await request(appInstance)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + refreshToken);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("refresh success");
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
    accessToken = response.body.data.accessToken; // new access token
    newRefreshToken = response.body.data.refreshToken;

    const response2 = await request(appInstance)
    .get("/users/me").set("Authorization", `Bearer ${accessToken}`);
    expect(response2.status).toBe(200);
    expect(response2.body.data).toBeDefined();
    expect(response2.body.data.name).toBe(testUserRegisterForm.userData.name);
    expect(response2.body.data._id).toBe(testUserRegisterForm._id);
  }); 

  test("Refresh Token - Invalid Token - Already Used, Not in DB Error", async () => {
    const response = await request(appInstance)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + refreshToken);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("invalid refresh token");

    const response2 = await request(appInstance)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + newRefreshToken);
    expect(response2.status).toBe(401);
    expect(response2.body.message).toBe("invalid refresh token");

    const response3 = await request(appInstance)
      .post("/auth/login")
      .send({
        email: testUserRegisterForm.authData.email,
        password: testUserRegisterForm.authData.password
      });
    expect(response3.status).toBe(200);
    expect(response3.body.data.accessToken).toBeDefined(); 
    expect(response3.body.data.refreshToken).toBeDefined(); 
    accessToken = response3.body.data.accessToken; 
    newRefreshToken = response3.body.data.refreshToken;
  });

  test("Logout user - Missing Token Error", async () => {
    const response = await request(appInstance)
      .post("/auth/logout");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("missing refresh token");
  }); 

  test("Logout user - Invalid Token Error", async () => {
    const response = await request(appInstance)
      .post("/auth/logout")
      .set("Authorization", "Bearer qw" + newRefreshToken);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("invalid refresh token");
  }); 


  test("Logout user", async () => {
    const response = await request(appInstance)
      .post("/auth/logout")
      .set("Authorization", "Bearer " + newRefreshToken);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("logout success");
  }); 

  test("Logout user - Invalid Token - Already Used, Not in DB Error", async () => {
    const response = await request(appInstance)
      .post("/auth/logout")
      .set("Authorization", "Bearer " + newRefreshToken);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("invalid refresh token");
  });
 
test("delete user", async () => {
    const response = await request(appInstance)
      .delete("/users/" + testUserRegisterForm._id)
      .set("Authorization", "Bearer " + accessToken);
    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(testUserRegisterForm._id);
  }); 

  test("Delete User - Invalid ID Error", async () => {
    const response = await request(appInstance)
      .delete("/users/123")
      .set("Authorization", "Bearer " + accessToken);
    expect(response.status).toBe(500);
    expect(response.body.message).toContain("Cast to ObjectId failed");
  });

});
