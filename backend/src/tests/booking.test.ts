import request from "supertest";
import { createApp } from "../index";

const app = createApp();

let userToken: string;
let sessionId: number;

beforeAll(async () => {
  // login as user
  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email: "user@classbook.com", password: "user123" });

  userToken = loginRes.body.accessToken;

  // create a class/session as admin
  const adminRes = await request(app)
    .post("/auth/login")
    .send({ email: "admin@classbook.com", password: "admin123" });

  const adminToken = adminRes.body.accessToken;

  const classRes = await request(app)
    .post("/admin/classes")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Science" });

  const sessionRes = await request(app)
    .post(`/admin/classes/${classRes.body.id}/sessions`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ dateTime: new Date(), capacity: 1 });

  sessionId = sessionRes.body.id;
});

describe("Booking API", () => {
  it("should allow user to book a seat", async () => {
    const res = await request(app)
      .post(`/user/sessions/${sessionId}/book`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.sessionId).toBe(sessionId);
  });

  it("should prevent double booking", async () => {
    const res = await request(app)
      .post(`/user/sessions/${sessionId}/book`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("ALREADY_BOOKED");
  });

  it("should free a seat after cancel", async () => {
    const res = await request(app)
      .delete(`/user/sessions/${sessionId}/cancel`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);

    // Rebook should now succeed
    const rebook = await request(app)
      .post(`/user/sessions/${sessionId}/book`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(rebook.status).toBe(200);
  });
});
