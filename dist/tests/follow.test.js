"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const user_auth_model_1 = __importDefault(require("../models/user_auth_model"));
const follow_model_1 = __importDefault(require("../models/follow_model"));
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
let accessTokenFollowing;
let accessTokenFollowed;
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    yield follow_model_1.default.deleteMany();
    yield user_auth_model_1.default.deleteMany({ $or: [{ email: testUserFollowing.authData.email }, { email: testUserFollowed.authData.email }] });
    yield user_model_1.default.deleteMany({ $or: [{ name: testUserFollowing.userData.name }, { name: testUserFollowed.userData.name }] });
    const responseRegFollowing = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserFollowing);
    testUserFollowing._id = responseRegFollowing.body.data._id;
    const responseLogFollowing = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserFollowing.authData.email,
        password: testUserFollowing.authData.password
    });
    accessTokenFollowing = responseLogFollowing.body.data.accessToken;
    const responseRegFollowed = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserFollowed);
    testUserFollowed._id = responseRegFollowed.body.data._id;
    const responseLogFollowed = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserFollowed.authData.email,
        password: testUserFollowed.authData.password
    });
    accessTokenFollowed = responseLogFollowed.body.data.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
const testFollow = {
    _id: undefined,
    follower: undefined,
    following: undefined
};
describe("FollowTests", () => {
    test("Get - Method not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get("/follows");
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("GetById - Method not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/follows/${testUserFollowed._id}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("Post - Method not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/follows")
            .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("Delete - Method not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/follows/${testUserFollowed._id}`)
            .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("FollowUser - Invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put("/follows/123")
            .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("FollowUser", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/follows/${testUserFollowed._id}`)
            .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Followed");
        expect(response.body.data.follower).toBe(testUserFollowing._id);
        expect(response.body.data.following._id).toBe(testUserFollowed._id);
        testFollow._id = response.body.data._id;
        testFollow.follower = response.body.data.follower;
        testFollow.following = response.body.data.following._id;
    }));
    test("Follower added at UserFollowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/users/${testUserFollowed._id}`)
            .set('Authorization', `Bearer ${accessTokenFollowed}`);
        expect(response.status).toBe(200);
        expect(response.body.data.followers.length).toBe(1);
        expect(response.body.data.followers[0].follower._id).toBe(testFollow.follower);
    }));
    test("Following added at UserFollowing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/users/${testUserFollowing._id}`)
            .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(200);
        expect(response.body.data.following.length).toBe(1);
        expect(response.body.data.following[0].following._id).toBe(testFollow.following);
    }));
    test("UnfollowUser", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/follows/${testUserFollowed._id}`)
            .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Unfollowed");
    }));
    test("Follower deleted at UserFollowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/users/${testUserFollowed._id}`)
            .set('Authorization', `Bearer ${accessTokenFollowed}`);
        expect(response.status).toBe(200);
        expect(response.body.data.followers.length).toBe(0);
    }));
    test("Following deleted at UserFollowing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/users/${testUserFollowing._id}`)
            .set('Authorization', `Bearer ${accessTokenFollowing}`);
        expect(response.status).toBe(200);
        expect(response.body.data.following.length).toBe(0);
    }));
});
//# sourceMappingURL=follow.test.js.map