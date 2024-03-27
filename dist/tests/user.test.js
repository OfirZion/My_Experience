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
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
let accessToken;
let refreshToken;
let newRefreshToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    yield user_model_1.default.deleteMany();
    yield user_auth_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
const testUserRegisterForm = {
    _id: undefined,
    authData: {
        email: "test@gmail.com",
        password: "123456Aa!"
    },
    userData: {
        name: "test",
        age: 20, imgUrl: "", my_rating: 0,
        followers: [],
        following: []
    }
};
describe("UserTests", () => {
    test("Get Users - Empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get("/users");
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual([]);
    }));
    test("Post User - Missing email/password error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/auth/register").send({
            userData: {
                name: "test",
                age: 20, imgUrl: "", my_rating: 0,
                followers: [],
                following: []
            },
            authData: {
                email: "test@gmail.com"
            }
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("missing email or password");
    }));
    test("Post User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserRegisterForm);
        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        testUserRegisterForm._id = response.body.data._id;
    }));
    test("Post User - Invalid Body error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/auth/register").send("123");
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("Cannot read properties");
    }));
    test("Get User - 1 User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get("/users");
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe(testUserRegisterForm.userData.name);
        expect(response.body.data[0]._id).toBe(testUserRegisterForm._id);
    }));
    test("Test duplicate user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/register")
            .send(testUserRegisterForm); // Try again to register with same user
        expect(response.status).toBe(406);
        expect(response.body.message).toEqual("Email already exists");
    }));
    test("Login user - Missing email/password error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/login")
            .send({
            email: testUserRegisterForm.authData.email
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("missing email or password");
    }));
    test("Login user - Incorrect email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/login")
            .send({
            email: "testUserRegisterForm@authData.email",
            password: testUserRegisterForm.authData.password
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("email or password incorrect");
    }));
    test("Login user - Incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/login")
            .send({
            email: testUserRegisterForm.authData.email,
            password: "testUserRegisterForm.authData.password"
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("email or password incorrect");
    }));
    test("Login user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/login")
            .send({
            email: testUserRegisterForm.authData.email,
            password: testUserRegisterForm.authData.password
        });
        expect(response.status).toBe(200);
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
        accessToken = response.body.data.accessToken;
        refreshToken = response.body.data.refreshToken;
    }));
    test("Me", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/users/me")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.name).toBe(testUserRegisterForm.userData.name);
        expect(response.body.data._id).toBe(testUserRegisterForm._id);
    }));
    test("Get User by query name", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/users?name=" + testUserRegisterForm.userData.name)
            .set("Authorization", "Bearer " + accessToken);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe("Data found - get");
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe(testUserRegisterForm.userData.name);
        expect(response.body.data[0]._id).toBe(testUserRegisterForm._id);
    }));
    test("Get User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/users/" + testUserRegisterForm._id)
            .set("Authorization", "Bearer " + accessToken);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe(testUserRegisterForm.userData.name);
    }));
    test("Get User by ID - Invalid ID Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/users/123")
            .set("Authorization", "Bearer " + accessToken);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("Cast to ObjectId failed");
    }));
    test("Get User by ID - Missing Token Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/users/" + testUserRegisterForm._id);
        expect(response.status).toBe(401);
    }));
    test("Get User by ID - Invalid Token Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/users/" + testUserRegisterForm._id)
            .set("Authorization", "Bearerqw" + accessToken);
        expect(response.status).toBe(401);
    }));
    test("Update User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .put("/users")
            .set("Authorization", "Bearer " + accessToken)
            .send(Object.assign(Object.assign({}, testUserRegisterForm), { userData: Object.assign(Object.assign({}, testUserRegisterForm.userData), { name: "newName", age: 23, imgUrl: "newImg" }), authData: Object.assign({}, testUserRegisterForm.authData) }));
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("newName");
        expect(response.body.data.age).toBe(23);
        expect(response.body.data.imgUrl).toBe("newImg");
        testUserRegisterForm.userData.name = response.body.data.name;
        testUserRegisterForm.userData.age = response.body.data.age;
        testUserRegisterForm.userData.imgUrl = response.body.data.imgUrl;
    }));
    test("Update User - Invalid Body error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .put("/users")
            .set("Authorization", "Bearer " + accessToken)
            .send("123");
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("Cannot read properties");
    }));
    jest.setTimeout(8000);
    test("Test access after timeout of token", () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 6000));
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/users/" + testUserRegisterForm._id)
            .set("Authorization", "Bearer " + accessToken);
        expect(response.status).not.toBe(200);
    }));
    test("Refresh Token - Missing Token Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/auth/refresh");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("missing refresh token");
    }));
    test("Refresh Token - Invalid Token Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/auth/refresh")
            .set("Authorization", "Bearer qw" + refreshToken);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("invalid refresh token");
    }));
    test("Refresh Token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/auth/refresh")
            .set("Authorization", "Bearer " + refreshToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("refresh success");
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
        accessToken = response.body.data.accessToken; // new access token
        newRefreshToken = response.body.data.refreshToken;
        const response2 = yield (0, supertest_1.default)(appInstance)
            .get("/users/me").set("Authorization", `Bearer ${accessToken}`);
        expect(response2.status).toBe(200);
        expect(response2.body.data).toBeDefined();
        expect(response2.body.data.name).toBe(testUserRegisterForm.userData.name);
        expect(response2.body.data._id).toBe(testUserRegisterForm._id);
    }));
    test("Refresh Token - Invalid Token - Already Used, Not in DB Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/auth/refresh")
            .set("Authorization", "Bearer " + refreshToken);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("invalid refresh token");
        const response2 = yield (0, supertest_1.default)(appInstance)
            .get("/auth/refresh")
            .set("Authorization", "Bearer " + newRefreshToken);
        expect(response2.status).toBe(401);
        expect(response2.body.message).toBe("invalid refresh token");
        const response3 = yield (0, supertest_1.default)(appInstance)
            .post("/auth/login")
            .send({
            email: testUserRegisterForm.authData.email,
            password: testUserRegisterForm.authData.password
        });
        expect(response3.status).toBe(200);
        expect(response3.body.data.accessToken).toBeDefined();
        expect(response3.body.data.refreshToken).toBeDefined();
        accessToken = response3.body.data.accessToken;
        newRefreshToken = response3.body.data.refreshToken;
    }));
    test("Logout user - Missing Token Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/logout");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("missing refresh token");
    }));
    test("Logout user - Invalid Token Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/logout")
            .set("Authorization", "Bearer qw" + newRefreshToken);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("invalid refresh token");
    }));
    test("Logout user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/logout")
            .set("Authorization", "Bearer " + newRefreshToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("logout success");
    }));
    test("Logout user - Invalid Token - Already Used, Not in DB Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/logout")
            .set("Authorization", "Bearer " + newRefreshToken);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("invalid refresh token");
    }));
    test("delete user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .delete("/users/" + testUserRegisterForm._id)
            .set("Authorization", "Bearer " + accessToken);
        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(testUserRegisterForm._id);
    }));
    test("Delete User - Invalid ID Error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .delete("/users/123")
            .set("Authorization", "Bearer " + accessToken);
        expect(response.status).toBe(500);
        expect(response.body.message).toContain("Cast to ObjectId failed");
    }));
});
//# sourceMappingURL=user.test.js.map