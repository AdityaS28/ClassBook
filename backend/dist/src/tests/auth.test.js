"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../src/index"); // adjust path if needed
const app = (0, index_1.createApp)();
describe("Auth API", () => {
    it("should reject bad login", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "fake@test.com", password: "wrong" });
        expect(res.status).toBe(401);
        expect(res.body.error.code).toBe("UNAUTHORIZED");
    });
    it("should login admin successfully", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "admin@classbook.com", password: "admin123" });
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
    });
});
//# sourceMappingURL=auth.test.js.map