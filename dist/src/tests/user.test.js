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
//import UserAuth from "../models/user_auth_model"; 
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
// let accessToken: string;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
    console.log("beforeAll");
    yield user_model_1.default.deleteMany(); // ({});
    //   User.deleteMany({ 'email': user.email });
    //   await request(app).post("/auth/register").send(user);
    //   const response = await request(app).post("/auth/login").send(user);
    //   accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.log("afterAll");
}));
const testUser = { name: "test", age: 20, imgUrl: "", my_rating: 0 };
describe("UserTests", () => {
    test("Get Users - Empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get("/users");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    const addUser = (testUser) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/users").send(testUser);
        expect(response.status).toBe(201);
        testUser._id = response.body._id; // Remove after implementing user_auth
        //expect(response.body.name).toBe(testUser.name);
    });
    test("Post User", () => __awaiter(void 0, void 0, void 0, function* () {
        addUser(testUser);
    }));
    test("Get User - 1 User", () => __awaiter(void 0, void 0, void 0, function* () {
        // const user = new User(testUser); // should be in the controller, applied in test above, need to refactor
        // await user.save();
        const response = yield (0, supertest_1.default)(appInstance).get("/users");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe(testUser.name);
        expect(response.body[0]._id).toBe(testUser._id);
    }));
    test("Test duplicate user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).post("/users").send(testUser); //.set("Authorization", "JWT " + accessToken)
        expect(response.status).toBe(406);
        expect(response.text).toContain("E11000 duplicate key error collection");
    }));
    test("Get User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).get("/users/" + testUser._id);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(testUser.name);
    }));
    test("Update User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).put("/users/" + testUser._id).send(Object.assign(Object.assign({}, testUser), { name: "newName" }));
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("newName");
    }));
    test("Delete User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(appInstance).delete("/users/" + testUser._id);
        expect(response.status).toBe(200);
        //expect(response.body.name).toBe("newName");
    }));
});
//# sourceMappingURL=user.test.js.map