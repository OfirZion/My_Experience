import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import UserAuth from "../models/user_auth_model";
import { Express } from "express";
import Post from "../models/user_post_model";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
let accessToken: string | undefined;
let accessTokenNotOwner: string | undefined;

const testUserForPost = {
    _id: undefined,
    authData: {
      email: "testPost@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testPost",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };

  const testUserNotOwner = {
    _id: undefined,
    authData: {
      email: "testPostNotOwner@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testPostNotOwner",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };

beforeAll(async () => {
  appInstance = await initApp(test_DB_URL);
  await Post.deleteMany();
  await UserAuth.deleteMany({$or:[{email: testUserForPost.authData.email}, {email: testUserNotOwner.authData.email}]});
  await User.deleteMany({$or:[{name: testUserForPost.userData.name}, {name: testUserNotOwner.userData.name}]});
  const responseReg = await request(appInstance).post("/auth/register").send(testUserForPost);
  testUserForPost._id = responseReg.body.data._id;
  const responseLog = await request(appInstance).post("/auth/login").send({
    email: testUserForPost.authData.email,
    password: testUserForPost.authData.password
  });
  accessToken = responseLog.body.data.accessToken; 

  const responseRegUserNO = await request(appInstance).post("/auth/register").send(testUserNotOwner);
  testUserNotOwner._id = responseRegUserNO.body.data._id;
  const responseLogUserNO = await request(appInstance).post("/auth/login").send({
    email: testUserNotOwner.authData.email,
    password: testUserNotOwner.authData.password
  });
  accessTokenNotOwner = responseLogUserNO.body.data.accessToken;

});

afterAll(async () => {
  await mongoose.disconnect();
}); 

const testPost = {
    _id: undefined,
    title: "test",
    message: "test",
    post_owner_name: "test",
    post_owner: undefined,
    ratings: [],
    imgUrl: "",
    exp_rating: 0,
    comments: [],
    }; 

describe("PostTests", () => {
    test("Get Posts - Empty", async () => {
        const response = await request(appInstance).get("/posts");
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual([]);
    });

    test("Post a Post", async () => {
        const response = await request(appInstance).post("/posts")
        .set("Authorization", `Bearer ${accessToken}`).send(testPost);
        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        testPost._id = response.body.data._id; 
        testPost.post_owner = response.body.data.post_owner;
    });

    test("Get Post - 1 Post", async () => {
        const response = await request(appInstance).get("/posts");
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    test("Get Post by ID", async () => {
        const response = await request(appInstance).get(`/posts/${testPost._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(testPost._id);
    });

    test("Get My Posts by Owner", async () => {
        const response = await request(appInstance).get(`/posts/owner/${testPost.post_owner}`)
        .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]._id).toBe(testPost._id);
        expect(response.body.data[0].post_owner._id).toBe(testPost.post_owner);
    }); 

    test("Update Post", async () => {
        const response = await request(appInstance).put(`/posts/${testPost._id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({title: "newTest", message: "newTest",imgUrl: "newImg", exp_rating: 5});
        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe("newTest");
        expect(response.body.data.message).toBe("newTest");
        expect(response.body.data.imgUrl).toBe("newImg");
        expect(response.body.data.exp_rating).toBe(5);
    }); 

    test("Update Post - Not Owner Error", async () => {
        const response = await request(appInstance).put(`/posts/${testPost._id}`)
        .set("Authorization", `Bearer ${accessTokenNotOwner}`)
        .send({title: "newTest", message: "newTest",imgUrl: "newImg", exp_rating: 5});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });

    test("Delete Post - Not Owner Error", async () => {
        const response = await request(appInstance).delete(`/posts/${testPost._id}`)
        .set("Authorization", `Bearer ${accessTokenNotOwner}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });

    test("Delete Post", async () => {
        const response = await request(appInstance).delete(`/posts/${testPost._id}`)
        .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(testPost._id);
        expect(response.body.message).toBe("Post deleted");
    });

    test("Post Post - Error", async () => {
        const response = await request(appInstance).post("/posts")
        .set("Authorization", `Bearer ${accessToken}`).send({});
        expect(response.status).toBe(406);
    });

    test("Get Post by ID - Error", async () => {
        const response = await request(appInstance).get(`/posts/123`);
        expect(response.status).toBe(500);
    });

    test("Get Post by Owner - Error", async () => {
        const response = await request(appInstance).get(`/posts/owner/123`)
        .set("Authorization", `Bearer ${accessToken}`).send({});
        expect(response.status).toBe(500);
    }); 

    test("Update Post - Error", async () => {
        const response = await request(appInstance).put(`/posts/123`)
        .set("Authorization", `Bearer ${accessToken}`).send({});
        expect(response.status).toBe(500); 
    }); 

    test("Update Post - Not Found error", async () => {
        const response = await request(appInstance).put(`/posts/${testPost._id}`)
        .set("Authorization", `Bearer ${accessToken}`).send({title: "newTest"});
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Post not found");
    });
    
    test("Delete Post - Error", async () => {
        const response = await request(appInstance).delete(`/posts/123`)
        .set("Authorization", `Bearer ${accessToken}`).send({});
        expect(response.status).toBe(500);
    }); 

    test("Delete Post - Not Found error", async () => {
        const response = await request(appInstance).delete(`/posts/${testPost._id}`)
        .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Post not found");
    });

});
   