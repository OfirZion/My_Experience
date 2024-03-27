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
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
let accessTokenOwner;
let accessTokenNotOwner;
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    yield user_comment_model_1.default.deleteMany();
    yield user_post_model_1.default.deleteMany({ post_owner_name: testPostofComment.post_owner_name });
    yield user_auth_model_1.default.deleteMany({ $or: [{ email: testUserOfComment.authData.email }, { email: testUserOfPost.authData.email }, { email: testUserNotOwner.authData.email }] });
    yield user_model_1.default.deleteMany({ $or: [{ name: testUserOfComment.userData.name }, { name: testUserOfPost.userData.name }, { name: testUserNotOwner.userData.name }] });
    const responseRegUserP = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserOfPost);
    testUserOfPost._id = responseRegUserP.body.data._id;
    const responseLogUserP = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserOfPost.authData.email,
        password: testUserOfPost.authData.password
    });
    accessTokenOwner = responseLogUserP.body.data.accessToken;
    const newPost = yield (0, supertest_1.default)(appInstance).post("/posts")
        .set("Authorization", `Bearer ${accessTokenOwner}`).send(testPostofComment);
    testPostofComment._id = newPost.body.data._id;
    testPostofComment.post_owner = newPost.body.data.post_owner;
    const responseRegUserC = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserOfComment);
    testUserOfComment._id = responseRegUserC.body.data._id;
    const responseLogUserC = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserOfComment.authData.email,
        password: testUserOfComment.authData.password
    });
    accessTokenOwner = responseLogUserC.body.data.accessToken;
    const responseRegUserNO = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserNotOwner);
    testUserNotOwner._id = responseRegUserNO.body.data._id;
    const responseLogUserNO = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserNotOwner.authData.email,
        password: testUserNotOwner.authData.password
    });
    accessTokenNotOwner = responseLogUserNO.body.data.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
const testComment = {
    _id: undefined,
    message: "test",
    comment_owner_name: "test",
    post: undefined,
    ratings: [],
    comment_owner: undefined,
};
describe("CommentTests", () => {
    test("Get Comments - Empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/comments/${testPostofComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual([]);
    }));
    test("Post a Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/comments/${testPostofComment._id}`)
            .set("Authorization", `Bearer ${accessTokenOwner}`).send(testComment);
        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        testComment._id = response.body.data._id;
        testComment.post = response.body.data.post;
        testComment.comment_owner = response.body.data.comment_owner;
    }));
    test("Get Comment - 1 Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/comments/${testPostofComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]._id).toBe(testComment._id);
        expect(response.body.data[0].post).toBe(testComment.post);
        expect(response.body.data[0].comment_owner).toBe(testComment.comment_owner._id);
    }));
    test("Update Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/comments/${testComment._id}`)
            .set("Authorization", `Bearer ${accessTokenOwner}`).send({ message: "testUpdate" });
        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe("testUpdate");
    }));
    test("Update Comment - Not Owner Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/comments/${testComment._id}`)
            .set("Authorization", `Bearer ${accessTokenNotOwner}`).send({ message: "testUpdate" });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete Comment - Not Owner Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/comments/${testComment._id}`)
            .set("Authorization", `Bearer ${accessTokenNotOwner}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/comments/${testComment._id}`)
            .set("Authorization", `Bearer ${accessTokenOwner}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Comment deleted");
    }));
    test("Get Comments - Empty after delete", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/comments/${testPostofComment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual([]);
    }));
    test("get comment - Invalid PostID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/comments/123`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("get 1 comment by ID - Invalid Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/comments/one_comment/123`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("post comment - Invalid PostID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/comments/123`)
            .set("Authorization", `Bearer ${accessTokenOwner}`).send(testComment);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("update comment - Invalid PostID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/comments/123`)
            .set("Authorization", `Bearer ${accessTokenOwner}`).send({ message: "testUpdate" });
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("update comment - Not Found Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/comments/${testComment._id}`)
            .set("Authorization", `Bearer ${accessTokenOwner}`).send({ message: "testUpdate" });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Comment not found");
    }));
    test("delete comment - Invalid CommentID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/comments/123`)
            .set("Authorization", `Bearer ${accessTokenOwner}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("Delete Comment - Not Found Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/comments/${testComment._id}`)
            .set("Authorization", `Bearer ${accessTokenOwner}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Comment not found");
    }));
});
//# sourceMappingURL=comment.test.js.map