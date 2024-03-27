import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import UserAuth from "../models/user_auth_model";
import { Express } from "express";
import Post from "../models/user_post_model";
import Comment from "../models/user_comment_model";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
let accessTokenOwner: string | undefined;
let accessTokenNotOwner: string | undefined;

const testUserOfComment = {
    _id: undefined,
    authData: {
      email: "testComment@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testComment",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };
  const testUserOfPost = {
    _id: undefined,
    authData: {
      email: "testPostComment@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testPostComment",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  }; 

  const testUserNotOwner = {
    _id: undefined,
    authData: {
      email: "testCommentNot@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testCommentNot",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };

  const testPostofComment = {
    _id: undefined,
    title: "testofComment",
    message: "testofComment",
    post_owner_name: "testofComment",
    post_owner: undefined,
    ratings: [],
    imgUrl: "",
    exp_rating: 0,
    comments: [],
    };

beforeAll(async () => {
  appInstance = await initApp(test_DB_URL);
  await Comment.deleteMany(); 
  await Post.deleteMany({post_owner_name: testPostofComment.post_owner_name});
  await UserAuth.deleteMany({$or:[{email: testUserOfComment.authData.email}, {email: testUserOfPost.authData.email}, {email: testUserNotOwner.authData.email}]});
  await User.deleteMany({$or:[{name: testUserOfComment.userData.name}, {name: testUserOfPost.userData.name}, {name: testUserNotOwner.userData.name}]});
  const responseRegUserP = await request(appInstance).post("/auth/register").send(testUserOfPost);
  testUserOfPost._id = responseRegUserP.body.data._id;
  const responseLogUserP = await request(appInstance).post("/auth/login").send({
    email: testUserOfPost.authData.email,
    password: testUserOfPost.authData.password
  });
  accessTokenOwner = responseLogUserP.body.data.accessToken;
  const newPost = await request(appInstance).post("/posts")
  .set("Authorization", `Bearer ${accessTokenOwner}`).send(testPostofComment); 
  testPostofComment._id = newPost.body.data._id;
  testPostofComment.post_owner = newPost.body.data.post_owner;
  const responseRegUserC = await request(appInstance).post("/auth/register").send(testUserOfComment);
  testUserOfComment._id = responseRegUserC.body.data._id;
  const responseLogUserC = await request(appInstance).post("/auth/login").send({
    email: testUserOfComment.authData.email,
    password: testUserOfComment.authData.password
  });
  accessTokenOwner = responseLogUserC.body.data.accessToken; 

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

const testComment = {
    _id: undefined,
    message: "test",
    comment_owner_name: "test",
    post: undefined,
    ratings: [],
    comment_owner: undefined,
 }; 

describe("CommentTests", () => {
    test("Get Comments - Empty", async () => {
        const response = await request(appInstance).get(`/comments/${testPostofComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual([]);
    });

    test("Post a Comment", async () => {
        const response = await request(appInstance).post(`/comments/${testPostofComment._id}`)
        .set("Authorization", `Bearer ${accessTokenOwner}`).send(testComment);
        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        testComment._id = response.body.data._id; 
        testComment.post = response.body.data.post;
        testComment.comment_owner = response.body.data.comment_owner;
    });

    test("Get Comment - 1 Comment", async () => {
        const response = await request(appInstance).get(`/comments/${testPostofComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]._id).toBe(testComment._id);
        expect(response.body.data[0].post).toBe(testComment.post);
        expect(response.body.data[0].comment_owner).toBe(testComment.comment_owner._id);
    });
 
    test("Update Comment", async () => {
        const response = await request(appInstance).put(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${accessTokenOwner}`).send({message: "testUpdate"});
        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("testUpdate");
    });

    test("Update Comment - Not Owner Error", async () => {
      const response = await request(appInstance).put(`/comments/${testComment._id}`)
      .set("Authorization", `Bearer ${accessTokenNotOwner}`).send({message: "testUpdate"});
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
    
    test("Delete Comment - Not Owner Error", async () => {
      const response = await request(appInstance).delete(`/comments/${testComment._id}`)
      .set("Authorization", `Bearer ${accessTokenNotOwner}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
  });

    test("Delete Comment", async () => {
        const response = await request(appInstance).delete(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${accessTokenOwner}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Comment deleted");
    });

    test("Get Comments - Empty after delete", async () => {
        const response = await request(appInstance).get(`/comments/${testPostofComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual([]); 
    });

    test("get comment - Invalid PostID error", async () => {
        const response = await request(appInstance).get(`/comments/123`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }); 

    test("get 1 comment by ID - Invalid Error", async () => {
        const response = await request(appInstance).get(`/comments/one_comment/123`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    });

    test("post comment - Invalid PostID error", async () => {
        const response = await request(appInstance).post(`/comments/123`)
        .set("Authorization", `Bearer ${accessTokenOwner}`).send(testComment);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
    });

    test("update comment - Invalid PostID error", async () => {
        const response = await request(appInstance).put(`/comments/123`)
        .set("Authorization", `Bearer ${accessTokenOwner}`).send({message: "testUpdate"});
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }); 

    test("update comment - Not Found Error", async () => {
        const response = await request(appInstance).put(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${accessTokenOwner}`).send({message: "testUpdate"});
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Comment not found");
    });

    test("delete comment - Invalid CommentID error", async () => {
        const response = await request(appInstance).delete(`/comments/123`)
        .set("Authorization", `Bearer ${accessTokenOwner}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    });

    test("Delete Comment - Not Found Error", async () => {
        const response = await request(appInstance).delete(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${accessTokenOwner}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Comment not found"); 
    }); 

 }); 
 