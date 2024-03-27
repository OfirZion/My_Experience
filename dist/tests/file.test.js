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
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const test_DB_URL = process.env.DB_TS_URL;
let appInstance;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    appInstance = yield (0, app_1.default)(test_DB_URL);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("File Tests", () => {
    test("upload file", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = `${__dirname}/play-button.png`;
        try {
            const response = yield (0, supertest_1.default)(appInstance)
                .post("/upload?file=").attach('file', filePath);
            expect(response.body.status).toBe(201);
            expect(response.body.message).toBe("File uploaded successfully");
            let url = response.body.data;
            url = url.replace(/^.*\/\/[^/]+/, '');
            const res = yield (0, supertest_1.default)(appInstance).get(url);
            expect(res.statusCode).toEqual(200);
        }
        catch (err) {
            expect(1).toEqual(2);
        }
    }));
});
//# sourceMappingURL=file.test.js.map