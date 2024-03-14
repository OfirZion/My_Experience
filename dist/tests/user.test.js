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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    console.log("beforeAll");
    yield user_model_1.default.deleteMany(); // ({});
    yield user_auth_model_1.default.deleteMany(); // ({});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    console.log("afterAll");
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
    test("Post User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/auth/register").send(testUserRegisterForm);
        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        testUserRegisterForm._id = response.body.data._id;
    }));
    test("Get User - 1 User", () => __awaiter(void 0, void 0, void 0, function* () {
        // const user = new User(testUser); // should be in the controller, applied in test above, need to refactor
        // await user.save();
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
        //expect(response.text).toEqual("User with this email already exists");
        expect(response.body.message).toEqual("Email already exists");
    }));
    test("Login user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .post("/auth/login")
            .send({
            email: testUserRegisterForm.authData.email,
            password: testUserRegisterForm.authData.password
        });
        accessToken = response.body.data.accessToken;
        expect(response.status).toBe(200);
        expect(accessToken).toBeDefined();
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
    test("Get User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance)
            .get("/users/" + testUserRegisterForm._id)
            .set("Authorization", "Bearer " + accessToken);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe(testUserRegisterForm.userData.name);
    }));
    /*test("Update User", async () => {
      const response = await request(appInstance).put("/users/" + testUser._id).send({... testUser, name: "newName" });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("newName");
    });
  
    test("Delete User", async () => {
      const response = await request(appInstance).delete("/users/" + testUser._id);
      expect(response.status).toBe(200);
      //expect(response.body.name).toBe("newName");
    }); */
});
//# sourceMappingURL=user.test.js.map