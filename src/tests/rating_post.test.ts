import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import UserAuth from "../models/user_auth_model";
import { Express } from "express";
import Post from "../models/user_post_model";
import PostRating, {IPostRating} from "../models/rating_post_model";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
let accessTokenRating: string | undefined;
let accessTokenRated: string | undefined;
let accessTokenNotOwner: string | undefined;

const testUserPostRating = {
    _id: undefined,
    authData: {
      email: "testUserOfPostRating@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserOfPostRating",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };
  const testUserOfPost = {
    _id: undefined,
    authData: {
      email: "testUserOfPostRated@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserOfPostRated",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  }; 

  const testUserOfPostNotOwner = {
    _id: undefined,
    authData: {
      email: "testUserOfPostRatedNotOwner@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserOfPostRatedNotOwner",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };

  const testPostRated= {
    _id: undefined,
    title: "testPostRated",
    message: "testPostRated",
    post_owner_name: "testofPostRated",
    post_owner: undefined,
    ratings: [],
    imgUrl: "",
    exp_rating: 0,
    comments: [],
    };

beforeAll(async () => {
  appInstance = await initApp(test_DB_URL);
  await PostRating.deleteMany(); 
  await Post.deleteMany({post_owner_name: testPostRated.post_owner_name});
  await UserAuth.deleteMany({$or:[{email: testUserPostRating.authData.email}, {email: testUserOfPost.authData.email}, {email: testUserOfPostNotOwner.authData.email}]});
  await User.deleteMany({$or:[{name: testUserPostRating.userData.name}, {name: testUserOfPost.userData.name}, {name: testUserOfPostNotOwner.userData.name}]});
  const responseRegUserP = await request(appInstance).post("/auth/register").send(testUserOfPost);
  testUserOfPost._id = responseRegUserP.body.data._id;
  const responseLogUserP = await request(appInstance).post("/auth/login").send({
    email: testUserOfPost.authData.email,
    password: testUserOfPost.authData.password
  });
  accessTokenRated = responseLogUserP.body.data.accessToken;
  const newPost = await request(appInstance).post("/posts")
  .set("Authorization", `Bearer ${accessTokenRated}`).send(testPostRated); 
  testPostRated._id = newPost.body.data._id;
  testPostRated.post_owner = newPost.body.data.post_owner;
  const responseRegUserPR = await request(appInstance).post("/auth/register").send(testUserPostRating);
  testUserPostRating._id = responseRegUserPR.body.data._id;
  const responseLogUserPR = await request(appInstance).post("/auth/login").send({
    email: testUserPostRating.authData.email,
    password: testUserPostRating.authData.password
  });
  accessTokenRating = responseLogUserPR.body.data.accessToken;

  const responseRegUserNO = await request(appInstance).post("/auth/register").send(testUserOfPostNotOwner);
  testUserOfPostNotOwner._id = responseRegUserNO.body.data._id;
    const responseLogUserNO = await request(appInstance).post("/auth/login").send({
    email: testUserOfPostNotOwner.authData.email,
    password: testUserOfPostNotOwner.authData.password
  });
  accessTokenNotOwner = responseLogUserNO.body.data.accessToken;

});

afterAll(async () => {
  await mongoose.disconnect();
}); 

const testPostRating = {
    _id: undefined,
    user: undefined,
    post: undefined,
    rating_type: 1
  }; 

describe("PostRating", () => {

    test("create a new like rating for a post - invalid postID error", async () => { 
        const response = await request(appInstance).post(`/postRatings/123`)
        .set("Authorization", `Bearer ${accessTokenRating}`).send(testPostRating);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
      });

    test("create a new like rating for a post", async () => {
      const response = await request(appInstance).post(`/postRatings/${testPostRated._id}`)
      .set("Authorization", `Bearer ${accessTokenRating}`).send(testPostRating);
      expect(response.status).toBe(201);
      expect(response.body.data.user).toBe(testUserPostRating._id);
      expect(response.body.data.post).toBe(testPostRated._id);
      expect(response.body.data.rating_type).toBe(testPostRating.rating_type);
      testPostRating._id = response.body.data._id;
      testPostRating.user = response.body.data.user;
      testPostRating.post = response.body.data.post;
    }); 

    test("Rating Created at Post", async () => {
        const response = await request(appInstance).get(`/posts/${testPostRated._id}`)
        .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating:IPostRating) => rating.user === testPostRating.user).length).toBe(1);
        });

    test("Get By ID Method not allowed", async () => {
        const response = await request(appInstance).get(`/postRatings/${testPostRating._id}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
        });

    test("Get Method not allowed", async () => {
          const response = await request(appInstance).get(`/postRatings`);
          expect(response.status).toBe(405);
          expect(response.body.message).toBe("Method not allowed");
      });    

    test("Delete a rating for a post - Unauthorized error", async () => {
        const response = await request(appInstance).delete(`/postRatings/${testPostRating._id}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
        });

    test("Delete a rating for a post - Not Owner error", async () => {
        const response = await request(appInstance).delete(`/postRatings/${testPostRating._id}`)
        .set("Authorization", `Bearer ${accessTokenNotOwner}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
        });    

    test("Delete a rating for a post", async () => {
        const response = await request(appInstance).delete(`/postRatings/${testPostRating._id}`)
        .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating deleted");
        });

    test("Delete a rating for a post - not found error", async () => {
        const response = await request(appInstance).delete(`/postRatings/${testPostRating._id}`)
        .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Rating not found");
        });  
    
    test("Delete a rating for a post - invalid ID error", async () => {
        const response = await request(appInstance).delete(`/postRatings/123`)
        .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
        });

    test("Rating deleted at Post", async () => {
        const response = await request(appInstance).get(`/posts/${testPostRated._id}`)
        .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating:IPostRating) => rating.user === testPostRating.user).length).toBe(0);
            testPostRating._id = undefined;
            testPostRating.user = undefined;
            testPostRating.post = undefined;
            testPostRating.rating_type = -1;    
        }); 

    test("create a new Dislike rating for a post via put - invalid postID error", async () => { 
            const response = await request(appInstance).put(`/postRatings/123`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send(testPostRating);
            expect(response.status).toBe(406);
            expect(response.body.message).toContain("ObjectId failed");
        });    
    
    test("create a new dislike rating for a post via put", async () => { 
        const response = await request(appInstance).put(`/postRatings/${testPostRated._id}`)
        .set("Authorization", `Bearer ${accessTokenRating}`).send({rating_type: testPostRating.rating_type});
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Rating created");
        expect(response.body.data.user._id).toBe(testUserPostRating._id);
        expect(response.body.data.post).toBe(testPostRated._id);
        expect(response.body.data.rating_type).toBe(testPostRating.rating_type);
        testPostRating._id = response.body.data._id;
        testPostRating.user = response.body.data.user;
        testPostRating.post = response.body.data.post;
      });    

    test("update a rating for a post", async () => {
      const response = await request(appInstance).put(`/postRatings/${testPostRated._id}`)
      .set("Authorization", `Bearer ${accessTokenRating}`).send({rating_type: 1});
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Rating updated - Changed");
      expect(response.body.data.user._id).toBe(testUserPostRating._id);
      expect(response.body.data.post).toBe(testPostRated._id);
      expect(response.body.data.rating_type).toBe(1);
      testPostRating.rating_type = response.body.data.rating_type;
    }); 

    test("Delete a rating for a post via put - Unauthorized error", async () => {
        const response = await request(appInstance).put(`/postRatings/${testPostRating._id}`)
        .send({rating_type: testPostRating.rating_type});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
        });

    test("update a rating for a post - delete via put", async () => { 
      const response = await request(appInstance).put(`/postRatings/${testPostRated._id}`)
      .set("Authorization", `Bearer ${accessTokenRating}`).send({rating_type: testPostRating.rating_type});
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Rating updated - Deleted");
    });

  }); 
      