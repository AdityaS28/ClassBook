import request from "supertest";
import { createApp } from "../../src/index"; // adjust path if needed

const app = createApp();

describe("Auth API", () => {
  it("should reject bad login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "fake@test.com", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should login admin successfully", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "admin@classbook.com", password: "admin123" });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
