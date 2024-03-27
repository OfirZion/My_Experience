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
const rating_user_model_1 = __importDefault(require("../models/rating_user_model"));
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
let accessTokenRating;
let accessTokenRated;
let accessTokenNotOwner;
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    yield rating_user_model_1.default.deleteMany();
    yield user_auth_model_1.default.deleteMany({ $or: [{ email: testUserRating.authData.email }, { email: testUserRated.authData.email }, { email: testUserRatedNotOwner.authData.email }] });
    yield user_model_1.default.deleteMany({ $or: [{ name: testUserRating.userData.name }, { name: testUserRated.userData.name }, { name: testUserRatedNotOwner.userData.name }] });
    const responseRegUserRated = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserRated);
    testUserRated._id = responseRegUserRated.body.data._id;
    const responseLogUserRated = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserRated.authData.email,
        password: testUserRated.authData.password
    });
    accessTokenRated = responseLogUserRated.body.data.accessToken;
    const responseRegUserRating = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserRating);
    testUserRating._id = responseRegUserRating.body.data._id;
    const responseLogUserRating = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserRating.authData.email,
        password: testUserRating.authData.password
    });
    accessTokenRating = responseLogUserRating.body.data.accessToken;
    const responseRegUserNO = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserRatedNotOwner);
    testUserRatedNotOwner._id = responseRegUserNO.body.data._id;
    const responseLogUserNO = yield (0, supertest_1.default)(appInstance).post("/auth/login").send({
        email: testUserRatedNotOwner.authData.email,
        password: testUserRatedNotOwner.authData.password
    });
    accessTokenNotOwner = responseLogUserNO.body.data.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
const testRating = {
    _id: undefined,
    rating_user: undefined,
    rated_user: undefined,
    rating: "",
    rating_type: 5
};
describe("Rating User Tests", () => {
    test("Create a New Rating", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/userRatings/${testUserRated._id}`).send(testRating)
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
    }));
    test("Rating added to Rated User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/users/${testUserRated._id}`)
            .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating) => rating.rating_user === testRating.rating_user).length).toBe(1);
    }));
    test("Update Rating", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/userRatings/${testUserRated._id}`)
            .send({ rating_type: testRating.rating_type }).set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating updated");
        expect(response.body.data.rating_type).toBe(testRating.rating_type);
    }));
    test("Rating already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/userRatings/${testUserRated._id}`)
            .send(testRating).set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating already exists");
        expect(response.body.data.rating_type).toBe(testRating.rating_type);
    }));
    test("Post - invalid ID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post(`/userRatings/123`)
            .send({ rating_type: 5 }).set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(406);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("Put Not Allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put(`/userRatings/${testUserRated._id}`)
            .send({ rating_type: 5 }).set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("Get Not Allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/userRatings`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("Get By ID Not Allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/userRatings/${testUserRated._id}`);
        expect(response.status).toBe(405);
        expect(response.body.message).toBe("Method not allowed");
    }));
    test("Delete Rating - Unauthorized error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/userRatings/${testRating._id}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete Rating - Not Owner error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/userRatings/${testRating._id}`)
            .set("Authorization", `Bearer ${accessTokenNotOwner}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    }));
    test("Delete Rating - Invalid ID error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/userRatings/123`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("ObjectId failed");
    }));
    test("Delete Rating", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/userRatings/${testRating._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Rating deleted");
    }));
    test("Rating deleted at Rated User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get(`/users/${testUserRated._id}`)
            .set("Authorization", `Bearer ${accessTokenRated}`);
        expect(response.status).toBe(200);
        expect(response.body.data.ratings
            .filter((rating) => rating.rating_user === testRating.rating_user).length).toBe(0);
    }));
    test("Delete Rating - Rating not found error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete(`/userRatings/${testRating._id}`)
            .set("Authorization", `Bearer ${accessTokenRating}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Rating not found");
    }));
});
//# sourceMappingURL=rating_user.test.js.map