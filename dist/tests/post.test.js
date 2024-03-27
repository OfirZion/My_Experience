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
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
let accessToken;
let accessTokenNotOwner;
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    yield user_post_model_1.default.deleteMany();
    yield user_auth_model_1.default.deleteMany({ $or: [{ email: testUserForPost.authData.email }, { email: testUserNotOwner.authData.email }] });
    yield user_model_1.default.deleteMany({ $or: [{ name: testUserForPost.userData.name }, { name: testUserNotOwner.userData.name }] });
    const responseReg = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserForPost);
    testUserForPost._id = responseReg.body.data._id;
    const responseLog = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserForPost.authData.email,
        password: testUserForPost.authData.password
    });
    accessToken = responseLog.body.data.accessToken;
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
    test("Get Posts - Empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get("/posts");
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual([]);
    }));
    test("Post a Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/posts")
            .set("Authorization", `Bearer ${accessToken}`).send(testPost);
        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        testPost._id = response.body.data._id;
        testPost.post_owner = response.body.data.post_owner;
    }));
    test("Get Post - 1 Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get("/posts");
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    }));
    test("Get Post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/posts/${testPost._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(testPost._id);
    }));
    test("Get My Posts by Owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/posts/owner/${testPost.post_owner}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]._id).toBe(testPost._id);
        expect(response.body.data[0].post_owner._id).toBe(testPost.post_owner);
    }));
    test("Update Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/posts/${testPost._id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ title: "newTest", message: "newTest", imgUrl: "newImg", exp_rating: 5 });
        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe("newTest");
        expect(response.body.data.message).toBe("newTest");
        expect(response.body.data.imgUrl).toBe("newImg");
        expect(response.body.data.exp_rating).toBe(5);
    }));
    test("Update Post - Not Owner Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/posts/${testPost._id}`)
            .set("Authorization", `Bearer ${accessTokenNotOwner}`)
            .send({ title: "newTest", message: "newTest", imgUrl: "newImg", exp_rating: 5 });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete Post - Not Owner Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/posts/${testPost._id}`)
            .set("Authorization", `Bearer ${accessTokenNotOwner}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/posts/${testPost._id}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(testPost._id);
        expect(response.body.message).toBe("Post deleted");
    }));
    test("Post Post - Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/posts")
            .set("Authorization", `Bearer ${accessToken}`).send({});
        expect(response.status).toBe(406);
    }));
    test("Get Post by ID - Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/posts/123`);
        expect(response.status).toBe(500);
    }));
    test("Get Post by Owner - Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/posts/owner/123`)
            .set("Authorization", `Bearer ${accessToken}`).send({});
        expect(response.status).toBe(500);
    }));
    test("Update Post - Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/posts/123`)
            .set("Authorization", `Bearer ${accessToken}`).send({});
        expect(response.status).toBe(500);
    }));
    test("Update Post - Not Found error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/posts/${testPost._id}`)
            .set("Authorization", `Bearer ${accessToken}`).send({ title: "newTest" });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Post not found");
    }));
    test("Delete Post - Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/posts/123`)
            .set("Authorization", `Bearer ${accessToken}`).send({});
        expect(response.status).toBe(500);
    }));
    test("Delete Post - Not Found error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/posts/${testPost._id}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Post not found");
    }));
});
//# sourceMappingURL=post.test.js.map