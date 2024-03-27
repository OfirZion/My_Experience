import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import UserAuth from "../models/user_auth_model";
import { Express } from "express";
import UserRating, {IUserRating} from "../models/rating_user_model";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;
let accessTokenRating: string | undefined;
let accessTokenRated: string | undefined;
let accessTokenNotOwner: string | undefined;

const testUserRating = {
    _id: undefined,
    authData: {
      email: "testUserRating@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserRating",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };
  const testUserRated = {
    _id: undefined,
    authData: {
      email: "testUserRated@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserRated",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  }; 

  const testUserRatedNotOwner = {
    _id: undefined,
    authData: {
      email: "testUserRatedNotOwner@gmail.com",
      password: "123456Aa!"
    },
    userData: {
      name: "testUserRatedNotOwner",
      age: 20, imgUrl: "", my_rating: 0,
      followers: [],
      following: []
    }
  };

  beforeAll(async () => {
    appInstance = await initApp(test_DB_URL);
    await UserRating.deleteMany(); 
    await UserAuth.deleteMany({$or:[{email: testUserRating.authData.email}, {email: testUserRated.authData.email}, {email: testUserRatedNotOwner.authData.email}]});
    await User.deleteMany({$or:[{name: testUserRating.userData.name}, {name: testUserRated.userData.name}, {name: testUserRatedNotOwner.userData.name}]});
    const responseRegUserRated = await request(appInstance).post("/auth/register").send(testUserRated);
    testUserRated._id = responseRegUserRated.body.data._id;
    const responseLogUserRated = await request(appInstance).post("/auth/login").send({
        email: testUserRated.authData.email,
        password: testUserRated.authData.password
      });
      accessTokenRated = responseLogUserRated.body.data.accessToken;
    const responseRegUserRating = await request(appInstance).post("/auth/register").send(testUserRating);
    testUserRating._id = responseRegUserRating.body.data._id;
    const responseLogUserRating = await request(appInstance).post("/auth/login").send({
      email: testUserRating.authData.email,
      password: testUserRating.authData.password
    });
    accessTokenRating = responseLogUserRating.body.data.accessToken;

    const responseRegUserNO = await request(appInstance).post("/auth/register").send(testUserRatedNotOwner);
    testUserRatedNotOwner._id = responseRegUserNO.body.data._id;
    const responseLogUserNO = await request(appInstance).post("/auth/login").send({
    email: testUserRatedNotOwner.authData.email,
    password: testUserRatedNotOwner.authData.password
  });
  accessTokenNotOwner = responseLogUserNO.body.data.accessToken;
  
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  }); 

  const testRating = {
    _id: undefined,
    rating_user: undefined,
    rated_user: undefined,
    rating: "",
    rating_type: 5
  }; 

  describe("Rating User Tests", () => {
    test("Create a New Rating", async () => {
      const response = await request(appInstance).post(`/userRatings/${testUserRated._id}`).send(testRating)
      .set("Authorization", `Bearer ${accessTokenRating}`);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Rating created");
      expect(response.body.data.rating_type).toBe(testRating.rating_type);
      expect(response.body.data.rating_user).toBe(testUserRating._id);
      expect(response.body.data.rated_user._id).toBe(testUserRated._id);
      testRating._id = response.body.data._id;
      testRating.rating_user = response.body.data.rating_user;
      testRating.rated_user = response.body.data.rated_user;
      testRating.rating_type = 7;
    });

    test("Rating added to Rated User", async () => {
        const response = await request(appInstance).get(`/users/${testUserRated._id}`)
        .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating:IUserRating) => rating.rating_user === testRating.rating_user).length).toBe(1);
        });
  
    test("Update Rating", async () => {
      const response = await request(appInstance).post(`/userRatings/${testUserRated._id}`)
      .send({rating_type: testRating.rating_type}).set("Authorization", `Bearer ${accessTokenRating}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Rating updated");
      expect(response.body.data.rating_type).toBe(testRating.rating_type);
    });
  
    test("Rating already exists", async () => {
      const response = await request(appInstance).post(`/userRatings/${testUserRated._id}`)
      .send(testRating).set("Authorization", `Bearer ${accessTokenRating}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Rating already exists");
      expect(response.body.data.rating_type).toBe(testRating.rating_type);
    }); 

    test("Post - invalid ID error", async () => {
        const response = await request(appInstance).post(`/userRatings/123`)
        .send({rating_type: 5}).set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
      });

      test("Put Not Allowed", async () => {
        const response = await request(appInstance).put(`/userRatings/${testUserRated._id}`)
        .send({rating_type: 5}).set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
      });

      test("Get Not Allowed", async () => {
        const response = await request(appInstance).get(`/userRatings`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
      });

      test("Get By ID Not Allowed", async () => {
        const response = await request(appInstance).get(`/userRatings/${testUserRated._id}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
      });

      test("Delete Rating - Unauthorized error", async () => {
        const response = await request(appInstance).delete(`/userRatings/${testRating._id}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
      });

      test("Delete Rating - Not Owner error", async () => {
        const response = await request(appInstance).delete(`/userRatings/${testRating._id}`)
        .set("Authorization", `Bearer ${accessTokenNotOwner}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
      });

      test("Delete Rating - Invalid ID error", async () => {
        const response = await request(appInstance).delete(`/userRatings/123`)
        .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
      });
        

      test("Delete Rating", async () => {
        const response = await request(appInstance).delete(`/userRatings/${testRating._id}`)
        .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating deleted");
      });

      test("Rating deleted at Rated User", async () => {
        const response = await request(appInstance).get(`/users/${testUserRated._id}`)
        .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating:IUserRating) => rating.rating_user === testRating.rating_user).length).toBe(0);
        });
    
      test("Delete Rating - Rating not found error", async () => {
        const response = await request(appInstance).delete(`/userRatings/${testRating._id}`)
        .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Rating not found");
      });

  }); 
  