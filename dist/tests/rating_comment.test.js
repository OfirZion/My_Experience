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
const user_comment_model_1 = __importDefault(require("../models/user_comment_model"));
const rating_comment_model_1 = __importDefault(require("../models/rating_comment_model"));
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
let accessTokenRating;
let accessTokenRated;
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    yield rating_comment_model_1.default.deleteMany();
    yield user_comment_model_1.default.deleteMany({ comment_owner_name: testComment.comment_owner_name });
    yield user_post_model_1.default.deleteMany({ post_owner_name: testPostofComment.post_owner_name });
    yield user_auth_model_1.default.deleteMany({ $or: [{ email: testUserOfComment.authData.email }, { email: testUserOfPost.authData.email }] });
    yield user_model_1.default.deleteMany({ $or: [{ name: testUserOfComment.userData.name }, { name: testUserOfPost.userData.name }] });
    const responseRegUserP = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserOfPost);
    testUserOfPost._id = responseRegUserP.body.data._id;
    const responseLogUserP = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserOfPost.authData.email,
        password: testUserOfPost.authData.password
    });
    accessTokenRating = responseLogUserP.body.data.accessToken;
    const newPost = yield (0, supertest_1.default)(appInstance).post("/posts")
        .set("Authorization", `Bearer ${accessTokenRating}`).send(testPostofComment);
    testPostofComment._id = newPost.body.data._id;
    testPostofComment.post_owner = newPost.body.data.post_owner;
    const responseRegUserC = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserOfComment);
    testUserOfComment._id = responseRegUserC.body.data._id;
    const responseLogUserC = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserOfComment.authData.email,
        password: testUserOfComment.authData.password
    });
    accessTokenRated = responseLogUserC.body.data.accessToken;
    const newComment = yield (0, supertest_1.default)(appInstance).post(`/comments/${testPostofComment._id}`)
        .set("Authorization", `Bearer ${accessTokenRated}`).send(testComment);
    testComment._id = newComment.body.data._id;
    testComment.post = newComment.body.data.post;
    testComment.comment_owner = newComment.body.data.comment_owner;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
const testCommentRating = {
    _id: undefined,
    user: undefined,
    comment: undefined,
    rating_type: 1
};
describe("CommentRating", () => {
    test("Create a new rating for a comment - Invalid CommentID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/commentRatings/123`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send(testCommentRating);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("Create a new rating for a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/commentRatings/${testComment._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`).send(testCommentRating);
        expect(response.status).toBe(201);
        expect(response.body.data.user).toBe(testUserOfPost._id);
        expect(response.body.data.comment).toBe(testComment._id);
        expect(response.body.data.rating_type).toBe(testCommentRating.rating_type);
        testCommentRating._id = response.body.data._id;
        testCommentRating.user = response.body.data.user;
        testCommentRating.comment = response.body.data.comment;
    }));
    test("Rating Created at Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/comments/one_comment/${testComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating) => rating.user === testCommentRating.user).length).toBe(1);
    }));
    test("Delete a rating for a comment - Invalid ID Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/commentRatings/123}`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("Delete a rating for a comment - Unauthorized Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/commentRatings/${testCommentRating._id}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete a rating for comment - Not Owner Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/commentRatings/${testCommentRating._id}`)
            .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete a rating for a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/commentRatings/${testCommentRating._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating deleted");
    }));
    test("Delete a rating for a comment - Not Found Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/commentRatings/${testCommentRating._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Rating not found");
    }));
    test("Rating Deleted at Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/comments/one_comment/${testComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating) => rating.user === testCommentRating.user).length).toBe(0);
    }));
    test("Put Method Not Allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/commentRatings/${testCommentRating._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("Get Method Not Allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/commentRatings/`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("GetByID Method Not Allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/commentRatings/${testCommentRating._id}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
});
//# sourceMappingURL=rating_comment.test.js.map