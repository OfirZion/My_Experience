import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import UserAuth from "../models/user_auth_model";
import { Express } from "express";
import Post from "../models/user_post_model";
import Comment from "../models/user_comment_model";
import CommentRating, {ICommentRating} from "../models/rating_comment_model";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
let accessTokenRating: string | undefined;
let accessTokenRated: string | undefined;

const testUserOfPost = {
    _id: undefined,
    authData: {
      email: "testPostCommentRating@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testPostCommentRating",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };

const testUserOfComment = {
    _id: undefined,
    authData: {
      email: "testUserComment@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserComment",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  }; 

 
  const testPostofComment = {
    _id: undefined,
    title: "testofCommentRating",
    message: "testofCommentRating",
    post_owner_name: "testofCommentRating",
    post_owner: undefined,
    ratings: [],
    imgUrl: "",
    exp_rating: 0,
    comments: [],
    }; 
   const testComment = {
        _id: undefined,
        message: "testCommentRating",
        comment_owner_name: "testCommentRating",
        post: undefined,
        ratings: [],
        comment_owner: undefined,
     };

beforeAll(async () => {
  appInstance = await initApp(test_DB_URL);
  await CommentRating.deleteMany(); 
  await Comment.deleteMany({comment_owner_name: testComment.comment_owner_name}); 
  await Post.deleteMany({post_owner_name: testPostofComment.post_owner_name});
  await UserAuth.deleteMany({$or:[{email: testUserOfComment.authData.email}, {email: testUserOfPost.authData.email}]}); 
  await User.deleteMany({$or:[{name: testUserOfComment.userData.name}, {name: testUserOfPost.userData.name}]}); 
  const responseRegUserP = await request(appInstance).post("/auth/register").send(testUserOfPost);
  testUserOfPost._id = responseRegUserP.body.data._id;
  const responseLogUserP = await request(appInstance).post("/auth/login").send({
    email: testUserOfPost.authData.email,
    password: testUserOfPost.authData.password
  });
  accessTokenRating = responseLogUserP.body.data.accessToken;
  const newPost = await request(appInstance).post("/posts")
  .set("Authorization", `Bearer ${accessTokenRating}`).send(testPostofComment); 
  testPostofComment._id = newPost.body.data._id;
  testPostofComment.post_owner = newPost.body.data.post_owner;
  const responseRegUserC = await request(appInstance).post("/auth/register").send(testUserOfComment);
  testUserOfComment._id = responseRegUserC.body.data._id;
  const responseLogUserC = await request(appInstance).post("/auth/login").send({
    email: testUserOfComment.authData.email,
    password: testUserOfComment.authData.password
  });
  accessTokenRated = responseLogUserC.body.data.accessToken;
  const newComment = await request(appInstance).post(`/comments/${testPostofComment._id}`)
  .set("Authorization", `Bearer ${accessTokenRated}`).send(testComment);
  testComment._id = newComment.body.data._id; 
  testComment.post = newComment.body.data.post;
  testComment.comment_owner = newComment.body.data.comment_owner;

});

afterAll(async () => {
  await mongoose.disconnect();
}); 

const testCommentRating = {
    _id: undefined,
    user: undefined,
    comment: undefined,
    rating_type: 1
  }; 

describe("CommentRating", () => {

    test("Create a new rating for a comment - Invalid CommentID", async () => {
        const response = await request(appInstance).post(`/commentRatings/123`)
        .set("Authorization", `Bearer ${accessTokenRating}`).send(testCommentRating);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
      });

    test("Create a new rating for a comment", async () => {
      const response = await request(appInstance).post(`/commentRatings/${testComment._id}`)
      .set("Authorization", `Bearer ${accessTokenRating}`).send(testCommentRating);
      expect(response.status).toBe(201);
      expect(response.body.data.user).toBe(testUserOfPost._id);
      expect(response.body.data.comment).toBe(testComment._id);
      expect(response.body.data.rating_type).toBe(testCommentRating.rating_type);
      testCommentRating._id = response.body.data._id;
      testCommentRating.user = response.body.data.user;
      testCommentRating.comment = response.body.data.comment;
    });

    test("Rating Created at Comment", async () => {
        const response = await request(appInstance).get(`/comments/one_comment/${testComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating:ICommentRating) => rating.user === testCommentRating.user).length).toBe(1);
        });

    
    test("Delete a rating for a comment - Invalid ID Error", async () => {
        const response = await request(appInstance).delete(`/commentRatings/123}`)
        .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    });

    test("Delete a rating for a comment - Unauthorized Error", async () => {
        const response = await request(appInstance).delete(`/commentRatings/${testCommentRating._id}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });  

    test("Delete a rating for comment - Not Owner Error", async () => {
        const response = await request(appInstance).delete(`/commentRatings/${testCommentRating._id}`)
        .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });

    test("Delete a rating for a comment", async () => {
      const response = await request(appInstance).delete(`/commentRatings/${testCommentRating._id}`)
      .set("Authorization", `Bearer ${accessTokenRating}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Rating deleted");
    });

    test("Delete a rating for a comment - Not Found Error", async () => {
      const response = await request(appInstance).delete(`/commentRatings/${testCommentRating._id}`)
      .set("Authorization", `Bearer ${accessTokenRating}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Rating not found");
    });

    test("Rating Deleted at Comment", async () => {
        const response = await request(appInstance).get(`/comments/one_comment/${testComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating:ICommentRating) => rating.user === testCommentRating.user).length).toBe(0);
    });

    test("Put Method Not Allowed", async () => {
        const response = await request(appInstance).put(`/commentRatings/${testCommentRating._id}`)
        .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }); 

    test("Get Method Not Allowed", async () => {
        const response = await request(appInstance).get(`/commentRatings/`)
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }); 

    test("GetByID Method Not Allowed", async () => {
        const response = await request(appInstance).get(`/commentRatings/${testCommentRating._id}`)
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    });

  }); 
 

