import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import UserAuth from "../models/user_auth_model";
import { Express } from "express";
import Follow  from '../models/follow_model';
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
let accessTokenFollowing: string | undefined;
let accessTokenFollowed: string | undefined;

const testUserFollowing = {
    _id: undefined,
    authData: {
      email: "testUserFollowing@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserFollowing",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };
  const testUserFollowed = {
    _id: undefined,
    authData: {
      email: "testUserFollowed@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserFollowed",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  }; 

  beforeAll(async () => {
    appInstance = await initApp(test_DB_URL);
    await Follow.deleteMany(); 
    await UserAuth.deleteMany({$or:[{email: testUserFollowing.authData.email}, {email: testUserFollowed.authData.email}]});
    await User.deleteMany({$or:[{name: testUserFollowing.userData.name}, {name: testUserFollowed.userData.name}]});
    const responseRegFollowing = await request(appInstance).post("/auth/register").send(testUserFollowing);
    testUserFollowing._id = responseRegFollowing.body.data._id;
    const responseLogFollowing = await request(appInstance).post("/auth/login").send({
        email: testUserFollowing.authData.email,
        password: testUserFollowing.authData.password
      });
      accessTokenFollowing = responseLogFollowing.body.data.accessToken;
    const responseRegFollowed = await request(appInstance).post("/auth/register").send(testUserFollowed);
    testUserFollowed._id = responseRegFollowed.body.data._id;
    const responseLogFollowed = await request(appInstance).post("/auth/login").send({
      email: testUserFollowed.authData.email,
      password: testUserFollowed.authData.password
    });
    accessTokenFollowed = responseLogFollowed.body.data.accessToken;
  
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  }); 

    const testFollow = {
        _id: undefined,
        follower: undefined,
        following: undefined
    };

  describe("FollowTests", () => {

    test("Get - Method not allowed", async () => {
        const response = await request(appInstance).get("/follows");
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    });
    test("GetById - Method not allowed", async () => {
        const response = await request(appInstance).get(`/follows/${testUserFollowed._id}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }); 

    test("Post - Method not allowed", async () => {
        const response = await request(appInstance).post("/follows")
        .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }); 

    test("Delete - Method not allowed", async () => {
        const response = await request(appInstance).delete(`/follows/${testUserFollowed._id}`)
        .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }); 

    test("FollowUser - Invalid ID", async () => {
        const response = await request(appInstance).put("/follows/123")
        .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
    });

    test("FollowUser", async () => {
        const response = await request(appInstance).put(`/follows/${testUserFollowed._id}`)
        .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Followed");
        expect(response.body.data.follower).toBe(testUserFollowing._id);
        expect(response.body.data.following._id).toBe(testUserFollowed._id);
        testFollow._id = response.body.data._id;
        testFollow.follower = response.body.data.follower;
        testFollow.following = response.body.data.following._id;
    });

    test("Follower added at UserFollowed", async () => {
        const response = await request(appInstance).get(`/users/${testUserFollowed._id}`)
        .set('Authorization', `Bearer ${accessTokenFollowed}`);
        expect(response.status).toBe(200);
        expect(response.body.data.followers.length).toBe(1);
        expect(response.body.data.followers[0].follower._id).toBe(testFollow.follower);
    });

    test("Following added at UserFollowing", async () => {
        const response = await request(appInstance).get(`/users/${testUserFollowing._id}`)
        .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(200);
        expect(response.body.data.following.length).toBe(1);
        expect(response.body.data.following[0].following._id).toBe(testFollow.following);
    });

    test("UnfollowUser", async () => {
        const response = await request(appInstance).put(`/follows/${testUserFollowed._id}`)
        .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Unfollowed");
    }); 

    test("Follower deleted at UserFollowed", async () => {
        const response = await request(appInstance).get(`/users/${testUserFollowed._id}`)
        .set('Authorization', `Bearer ${accessTokenFollowed}`);
        expect(response.status).toBe(200);
        expect(response.body.data.followers.length).toBe(0);
    }); 

    test("Following deleted at UserFollowing", async () => {
        const response = await request(appInstance).get(`/users/${testUserFollowing._id}`)
        .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(200);
        expect(response.body.data.following.length).toBe(0);
  }); 
});
