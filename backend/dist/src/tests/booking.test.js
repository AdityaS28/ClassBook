"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const app = (0, index_1.createApp)();
let userToken;
let sessionId;
beforeAll(async () => {
    // login as user
    const loginRes = await (0, supertest_1.default)(app)
        .post("/auth/login")
        .send({ email: "user@classbook.com", password: "user123" });
    userToken = loginRes.body.accessToken;
    // create a class/session as admin
    const adminRes = await (0, supertest_1.default)(app)
        .post("/auth/login")
        .send({ email: "admin@classbook.com", password: "admin123" });
    const adminToken = adminRes.body.accessToken;
    const classRes = await (0, supertest_1.default)(app)
        .post("/admin/classes")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Science" });
    const sessionRes = await (0, supertest_1.default)(app)
        .post(`/admin/classes/${classRes.body.id}/sessions`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ dateTime: new Date(), capacity: 1 });
    sessionId = sessionRes.body.id;
});
describe("Booking API", () => {
    it("should allow user to book a seat", async () => {
        const res = await (0, supertest_1.default)(app)
            .post(`/user/sessions/${sessionId}/book`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.sessionId).toBe(sessionId);
    });
    it("should prevent double booking", async () => {
        const res = await (0, supertest_1.default)(app)
            .post(`/user/sessions/${sessionId}/book`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("ALREADY_BOOKED");
    });
    it("should free a seat after cancel", async () => {
        const res = await (0, supertest_1.default)(app)
            .delete(`/user/sessions/${sessionId}/cancel`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        // Rebook should now succeed
        const rebook = await (0, supertest_1.default)(app)
            .post(`/user/sessions/${sessionId}/book`)
            .set("Authorization", `Bearer ${userToken}`);
        expect(rebook.status).toBe(200);
    });
});
//# sourceMappingURL=booking.test.js.map