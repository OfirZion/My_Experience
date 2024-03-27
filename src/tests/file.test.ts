import initApp from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
const test_DB_URL = process.env.DB_TS_URL;

let appInstance: Express;

beforeAll(async () => {
    appInstance = await initApp(test_DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/play-button.png`;

        try {
            const response = await request(appInstance)
                .post("/upload?file=").attach('file', filePath)
            expect(response.body.status).toBe(201);
            expect(response.body.message).toBe("File uploaded successfully");
            let url = response.body.data;
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(appInstance).get(url)
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            expect(1).toEqual(2);
        }
    })
})