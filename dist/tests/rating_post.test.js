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
const user_post_model_1 = __importDefault(require("../models/user_post_model"));
const rating_post_model_1 = __importDefault(require("../models/rating_post_model"));
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
let accessTokenRating;
let accessTokenRated;
let accessTokenNotOwner;
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
const testPostRated = {
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    yield rating_post_model_1.default.deleteMany();
    yield user_post_model_1.default.deleteMany({ post_owner_name: testPostRated.post_owner_name });
    yield user_auth_model_1.default.deleteMany({ $or: [{ email: testUserPostRating.authData.email }, { email: testUserOfPost.authData.email }, { email: testUserOfPostNotOwner.authData.email }] });
    yield user_model_1.default.deleteMany({ $or: [{ name: testUserPostRating.userData.name }, { name: testUserOfPost.userData.name }, { name: testUserOfPostNotOwner.userData.name }] });
    const responseRegUserP = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserOfPost);
    testUserOfPost._id = responseRegUserP.body.data._id;
    const responseLogUserP = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserOfPost.authData.email,
        password: testUserOfPost.authData.password
    });
    accessTokenRated = responseLogUserP.body.data.accessToken;
    const newPost = yield (0, supertest_1.default)(appInstance).post("/posts")
        .set("Authorization", `Bearer ${accessTokenRated}`).send(testPostRated);
    testPostRated._id = newPost.body.data._id;
    testPostRated.post_owner = newPost.body.data.post_owner;
    const responseRegUserPR = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserPostRating);
    testUserPostRating._id = responseRegUserPR.body.data._id;
    const responseLogUserPR = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserPostRating.authData.email,
        password: testUserPostRating.authData.password
    });
    accessTokenRating = responseLogUserPR.body.data.accessToken;
    const responseRegUserNO = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserOfPostNotOwner);
    testUserOfPostNotOwner._id = responseRegUserNO.body.data._id;
    const responseLogUserNO = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserOfPostNotOwner.authData.email,
        password: testUserOfPostNotOwner.authData.password
    });
    accessTokenNotOwner = responseLogUserNO.body.data.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
const testPostRating = {
    _id: undefined,
    user: undefined,
    post: undefined,
    rating_type: 1
};
describe("PostRating", () => {
    test("create a new like rating for a post - invalid postID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/postRatings/123`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send(testPostRating);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("create a new like rating for a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/postRatings/${testPostRated._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send(testPostRating);
        expect(response.status).toBe(201);
        expect(response.body.data.user).toBe(testUserPostRating._id);
        expect(response.body.data.post).toBe(testPostRated._id);
        expect(response.body.data.rating_type).toBe(testPostRating.rating_type);
        testPostRating._id = response.body.data._id;
        testPostRating.user = response.body.data.user;
        testPostRating.post = response.body.data.post;
    }));
    test("Rating Created at Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/posts/${testPostRated._id}`)
            .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating) => rating.user === testPostRating.user).length).toBe(1);
    }));
    test("Get By ID Method not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/postRatings/${testPostRating._id}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("Get Method not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/postRatings`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("Delete a rating for a post - Unauthorized error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/postRatings/${testPostRating._id}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete a rating for a post - Not Owner error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/postRatings/${testPostRating._id}`)
            .set("Authorization", `Bearer ${accessTokenNotOwner}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete a rating for a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/postRatings/${testPostRating._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating deleted");
    }));
    test("Delete a rating for a post - not found error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/postRatings/${testPostRating._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Rating not found");
    }));
    test("Delete a rating for a post - invalid ID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/postRatings/123`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("Rating deleted at Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/posts/${testPostRated._id}`)
            .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating) => rating.user === testPostRating.user).length).toBe(0);
        testPostRating._id = undefined;
        testPostRating.user = undefined;
        testPostRating.post = undefined;
        testPostRating.rating_type = -1;
    }));
    test("create a new Dislike rating for a post via put - invalid postID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/postRatings/123`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send(testPostRating);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("create a new dislike rating for a post via put", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/postRatings/${testPostRated._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send({ rating_type: testPostRating.rating_type });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Rating created");
        expect(response.body.data.user._id).toBe(testUserPostRating._id);
        expect(response.body.data.post).toBe(testPostRated._id);
        expect(response.body.data.rating_type).toBe(testPostRating.rating_type);
        testPostRating._id = response.body.data._id;
        testPostRating.user = response.body.data.user;
        testPostRating.post = response.body.data.post;
    }));
    test("update a rating for a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/postRatings/${testPostRated._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send({ rating_type: 1 });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating updated - Changed");
        expect(response.body.data.user._id).toBe(testUserPostRating._id);
        expect(response.body.data.post).toBe(testPostRated._id);
        expect(response.body.data.rating_type).toBe(1);
        testPostRating.rating_type = response.body.data.rating_type;
    }));
    test("Delete a rating for a post via put - Unauthorized error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/postRatings/${testPostRating._id}`)
            .send({ rating_type: testPostRating.rating_type });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("update a rating for a post - delete via put", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/postRatings/${testPostRated._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send({ rating_type: testPostRating.rating_type });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating updated - Deleted");
    }));
});
//# sourceMappingURL=rating_post.test.js.map